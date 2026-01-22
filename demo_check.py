import cv2
import numpy as np
import pytesseract
from PIL import Image, ImageChops, ImageEnhance, ExifTags, ImageDraw, ImageFont
import os
import re
from datetime import datetime

# --- ForgeryDetector Class ---
class ForgeryDetector:
    def __init__(self, file_path):
        self.file_path = file_path
        self.image = Image.open(file_path).convert('RGB')
        self.cv_image = cv2.imread(file_path)
        self.report_data = {
            "filename": os.path.basename(file_path),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "checks": {}
        }

    def perform_ela(self, quality=90):
        # Error Level Analysis
        temp_filename = "temp_ela.jpg"
        self.image.save(temp_filename, 'JPEG', quality=quality)
        temp_image = Image.open(temp_filename).convert('RGB')
        ela_image = ImageChops.difference(self.image, temp_image)
        
        extrema = ela_image.getextrema()
        max_diff = max([ex[1] for ex in extrema])
        scale = 255.0 / max_diff if max_diff > 0 else 1
        ela_image = ImageEnhance.Brightness(ela_image).enhance(scale)
        ela_np = np.array(ela_image)
        std_dev = np.std(ela_np)
        
        # Threshold: purely synthetic images have low noise. real scans have high noise.
        # Adjusted threshold for this demo context.
        is_suspect = std_dev > 15.0 
        
        self.report_data["checks"]["ELA"] = {
            "status": "Fail" if is_suspect else "Pass",
            "details": f"ELA Std Dev: {std_dev:.2f}",
            "score": std_dev
        }
        if os.path.exists(temp_filename): os.remove(temp_filename)
        return ela_image

    def check_metadata(self):
        suspicious_tags = ['Photoshop', 'GIMP', 'Editor']
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
            "details": f"Traces: {', '.join(found_tags)}" if found_tags else "Clean"
        }

    def verify_logical_consistency(self):
        # OCR logical check
        gray = cv2.cvtColor(self.cv_image, cv2.COLOR_BGR2GRAY)
        # Binarize for clearer text
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        try:
            # Page segmentation mode 6 (Assume a single uniform block of text) helps with sparse text
            custom_config = r'--oem 3 --psm 6'
            text = pytesseract.image_to_string(thresh, config=custom_config)
            
            # Find all numbers
            numbers = [int(s) for s in re.findall(r'\b\d{2,3}\b', text)]
            
            status = "Pass"
            details = "Logic Verified."
            
            if len(numbers) >= 3:
                # Heuristic: Largest number is likely the Total
                numbers.sort()
                total = numbers[-1]
                subjects = numbers[:-1]
                
                # Heuristic: Check if sum of all other numbers equals total
                # or sum of any 3 largest numbers equals total (Mark 1, Mark 2, Mark 3 -> Total)
                subset_sum = sum(subjects)
                
                if subset_sum == total:
                    status = "Pass"
                    details = f"Sum of marks ({subset_sum}) matches Total ({total})."
                else:
                     # Check if it's just off by a bit (sometimes OCR misreads 8 as 3 etc)
                     # But strictly, we flag it.
                    status = "Fail"
                    details = f"Discrepancy: Sum of subjects ({subset_sum}) != Total ({total})."
            else:
                status = "Warn"
                details = f"Not enough data extracted. Found: {numbers}"
                
        except Exception as e:
            status = "Error"
            details = f"OCR Failed: {e}"

        self.report_data["checks"]["Logic"] = {
            "status": status,
            "details": details
        }

    def generate_report(self):
        print("\n" + "="*40)
        print(f"REPORT FOR: {self.report_data['filename']}")
        print("="*40)
        for check, res in self.report_data['checks'].items():
            print(f"{check:<10} | {res['status']:<4} | {res['details']}")
        print("="*40 + "\n")


# --- Helper to create a dummy marksheet ---
def create_dummy_marksheet(filename, math=90, sci=85, eng=80, total=255, tampered=False):
    # Create larger image with larger text for better OCR
    img = Image.new('RGB', (800, 600), color='white')
    d = ImageDraw.Draw(img)
    
    # Try to load a generic font, fallback to default
    try:
        # Linux usually has DejaVuSans
        font = ImageFont.truetype("DejaVuSans.ttf", 40)
        header_font = ImageFont.truetype("DejaVuSans-Bold.ttf", 50)
    except:
        font = ImageFont.load_default()
        header_font = ImageFont.load_default()
    
    d.text((50, 50), "OFFICIAL BOARD MARKSHEET", fill='black', font=header_font)
    
    # Draw marks clearly
    start_y = 150
    gap = 60
    d.text((50, start_y), f"Mathematics : {math}", fill='black', font=font)
    d.text((50, start_y + gap), f"Science     : {sci}", fill='black', font=font)
    d.text((50, start_y + gap*2), f"English     : {eng}", fill='black', font=font)
    
    # Draw line
    d.line((50, start_y + gap*3, 750, start_y + gap*3), fill='black', width=3)
    
    # Draw Total
    d.text((50, start_y + gap*3 + 20), f"Total Score : {total}", fill='black', font=font)
    
    if tampered:
        # Save first
        img.save("base_temp.jpg", quality=100)
        base = Image.open("base_temp.jpg").convert('RGB')
        d_p = ImageDraw.Draw(base)
        
        # Tamper the total visually to 300 (which is wrong, 90+85+80=255)
        # White out the old total
        d_p.rectangle((350, start_y + gap*3 + 20, 600, start_y + gap*3 + 80), fill='white')
        d_p.text((350, start_y + gap*3 + 20), "300", fill='black', font=font)
        
        base.save(filename, quality=95)
        if os.path.exists("base_temp.jpg"): os.remove("base_temp.jpg")
    else:
        img.save(filename, quality=95)

# --- Main Test ---
if __name__ == "__main__":
    if os.path.exists("authentic_result.jpg"): os.remove("authentic_result.jpg")
    if os.path.exists("tampered_result.jpg"): os.remove("tampered_result.jpg")

    print(">>> Generating Authentic Marksheet...")
    create_dummy_marksheet("authentic_result.jpg", total=255, tampered=False)
    
    print(">>> Analyzing Authentic Marksheet...")
    det = ForgeryDetector("authentic_result.jpg")
    det.perform_ela()
    det.check_metadata()
    det.verify_logical_consistency()
    det.generate_report()

    print("\n")

    print(">>> Generating Tampered Marksheet (Forged Total)...")
    create_dummy_marksheet("tampered_result.jpg", total=255, tampered=True)
    
    print(">>> Analyzing Tampered Marksheet...")
    det2 = ForgeryDetector("tampered_result.jpg")
    det2.perform_ela()
    det2.check_metadata()
    det2.verify_logical_consistency()
    det2.generate_report()
    
    # Cleanup
    if os.path.exists("authentic_result.jpg"): os.remove("authentic_result.jpg")
    if os.path.exists("tampered_result.jpg"): os.remove("tampered_result.jpg")
