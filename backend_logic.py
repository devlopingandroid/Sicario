import cv2
import numpy as np
import pytesseract
from PIL import Image, ImageChops, ImageEnhance, ExifTags
import os
import re
from datetime import datetime

class ForgeryDetector:
    def __init__(self, file_path):
        self.file_path = file_path
        self.image = Image.open(file_path).convert('RGB')
        self.cv_image = cv2.imread(file_path)
        self.report_data = {
            "filename": os.path.basename(file_path),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "checks": {},
            "ela_path": None
        }

    def perform_ela(self, quality=90, output_dir="."):
        temp_filename = "temp_ela_source.jpg"
        self.image.save(temp_filename, 'JPEG', quality=quality)
        temp_image = Image.open(temp_filename).convert('RGB')
        ela_image = ImageChops.difference(self.image, temp_image)
        
        extrema = ela_image.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        scale = 255.0 / max_diff if max_diff > 0 else 1
        ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)
        ela_np = np.array(ela_image)
        std_dev = np.std(ela_np)
        
        # Heuristic threshold
        is_suspect = std_dev > 14.0 
        
        ela_out_name = f"ela_{os.path.basename(self.file_path)}"
        ela_out_path = os.path.join(output_dir, ela_out_name)
        ela_image.save(ela_out_path)
        self.report_data["ela_path"] = ela_out_name
        
        self.report_data["checks"]["ELA"] = {
            "status": "Fail" if is_suspect else "Pass",
            "details": f"ELA Std Dev: {std_dev:.2f}. High variance suggests modification.",
            "score": std_dev
        }
        if os.path.exists(temp_filename): os.remove(temp_filename)
        return ela_out_path

    def check_metadata(self):
        suspicious_tags = ['Photoshop', 'GIMP', 'Editor', 'Adobe']
        found_tags = []
        try:
            exif_data = self.image.getexif()
            if exif_data:
                for tag, value in exif_data.items():
                    decoded = ExifTags.TAGS.get(tag, tag)
                    val_str = str(value)
                    for sus in suspicious_tags:
                        if sus.lower() in val_str.lower():
                            found_tags.append(f"{decoded}: {val_str}")
        except:
            pass
            
        self.report_data["checks"]["Metadata"] = {
            "status": "Fail" if found_tags else "Pass",
            "details": f"Traces found: {', '.join(found_tags)}" if found_tags else "No editing software traces found."
        }

    def verify_logical_consistency(self):
        # OCR logical check
        gray = cv2.cvtColor(self.cv_image, cv2.COLOR_BGR2GRAY)
        # Otsu thresholding
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        try:
            # PSM 6 assumes a single uniform block of text
            custom_config = r'--oem 3 --psm 6'
            text = pytesseract.image_to_string(thresh, config=custom_config)
            
            # Simple heuristic extraction of marks
            # Look for 2 or 3 digit numbers
            numbers = [int(s) for s in re.findall(r'\b\d{2,3}\b', text)]
            
            status = "Pass"
            details = "Logic Verified."
            
            if len(numbers) >= 3:
                numbers.sort()
                total = numbers[-1]
                subjects = numbers[:-1]
                
                # Check sum of subjects vs total
                subset_sum = sum(subjects)
                
                # We can also check if subset_sum is close to total if we worry about OCR errors
                # But strict check is better for forgery detection
                if subset_sum == total:
                    status = "Pass"
                    details = f"Sum of marks ({subset_sum}) matches Total ({total})."
                else:
                    status = "Fail"
                    details = f"Logical Discrepancy: Sum of subjects ({subset_sum}) != Total ({total})."
            else:
                status = "Warn"
                details = f"Insufficient data for logic check. Found numbers: {numbers}"
                
        except Exception as e:
            status = "Error"
            details = f"OCR process failed: {str(e)}"

        self.report_data["checks"]["Logic"] = {
            "status": status,
            "details": details
        }
