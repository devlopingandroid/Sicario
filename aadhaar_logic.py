import cv2
import pytesseract
import re
import numpy as np
import random
from PIL import Image

# --- 1. THE VERHOEFF ALGORITHM (For Mathematical Validation) ---
class VerhoeffValidator:
    def __init__(self):
        self.d = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
            [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
            [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
            [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
            [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
            [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
            [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
            [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
            [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
        ]
        self.p = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
            [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
            [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
            [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
            [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
            [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
            [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
        ]
        self.inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]

    def validate(self, number_str):
        if not number_str.isdigit() or len(number_str) != 12:
            return False
        c = 0
        reversed_num = map(int, reversed(number_str))
        for i, n in enumerate(reversed_num):
            c = self.d[c][self.p[i % 8][n]]
        return c == 0

# --- 2. SECURITY LAYER (Mock Database) ---
class SecurityLayer:
    def __init__(self):
        self.authorized_db = set()
        self._load_database()

    def _load_database(self):
        # 1. Specific IDs
        self.authorized_db.add("779868767875")
        self.authorized_db.add("800429588109")

        # 2. Mock Data
        random.seed(42) # Deterministic for consistent testing
        while len(self.authorized_db) < 100:
            dummy_id = str(random.randint(100000000000, 999999999999))
            self.authorized_db.add(dummy_id)

    def verify_uid(self, uid):
        clean_uid = uid.replace(" ", "").strip()
        if clean_uid in self.authorized_db:
             return True, "✅ PASS: ID found in authorized database."
        else:
             return False, "❌ FAIL: ID not found in database."

# --- 3. AADHAAR OCR PROCESSOR ---
class AadhaarAnalyzer:
    def __init__(self):
        self.validator = VerhoeffValidator()
        self.security = SecurityLayer()

    def get_text_from_image(self, img, config):
        return pytesseract.image_to_string(img, config=config)

    def analyze(self, image_path):
        report = {
            "status": "Unknown",
            "details": "",
            "number_found": None,
            "verhoeff_valid": False,
            "db_valid": False
        }

        try:
            # 1. Load Original Image
            original_img = cv2.imread(image_path)
            if original_img is None:
                raise ValueError("Could not load image file.")

            # List of preprocessing strategies to try
            # Strategy: [Resize, Color, ThresholdConfig]
            ocr_text = ""
            strategies = [
                "Otsu Threshold", 
                "Adaptive Threshold", 
                "Grayscale Only", 
                "Original"
            ]

            found_match = None

            for strategy in strategies:
                img_copy = original_img.copy()

                # Basic Preprocessing: Resize (Upscale) for better OCR
                img_copy = cv2.resize(img_copy, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
                gray = cv2.cvtColor(img_copy, cv2.COLOR_BGR2GRAY)

                if strategy == "Otsu Threshold":
                   processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
                elif strategy == "Adaptive Threshold":
                   processed = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
                elif strategy == "Grayscale Only":
                   processed = gray
                else:
                   processed = img_copy

                # OCR Extraction
                # psm 6 = Assume a single uniform block of text.
                # psm 3 = Fully automatic page segmentation, but no OSD. (Default)
                # psm 11 = Sparse text. Find as much text as possible in no particular order.
                
                # We try PSM 6 first (Block of text) then PSM 11 (Sparse)
                configs = [r'--oem 3 --psm 6', r'--oem 3 --psm 11']
                
                for config in configs:
                    text = self.get_text_from_image(processed, config)
                    
                    # Debug print
                    # print(f"Strategy: {strategy} | Config: {config} | Found: {text[:20]}...")

                    # Regex 1: Standard xxxx xxxx xxxx
                    match = re.search(r'\b\d{4}\s\d{4}\s\d{4}\b', text)
                    if not match:
                        # Regex 2: Compact xxxxxxxxxxxx
                        match = re.search(r'\b\d{12}\b', text)
                    if not match:
                         # Regex 3: Flexible spaces/newlines (Catch cases like 1234\n5678\n9012)
                         # Clean text first
                         cleaned = re.sub(r'[^0-9]', '', text)
                         # Look for 12 digit sequence in clean text
                         if len(cleaned) >= 12:
                             # Scan through cleaned text for valid Verhoeff
                             for i in range(len(cleaned) - 11):
                                 candidate = cleaned[i:i+12]
                                 if self.validator.validate(candidate):
                                     # Found a structurally valid number!
                                     found_match = candidate
                                     ocr_text = f"Found via deep scan: {candidate}"
                                     break
                    
                    if match:
                        found_match = match.group(0)
                        ocr_text = text
                    
                    if found_match:
                        break # Break Config Loop
                
                if found_match:
                    break # Break Strategy Loop
            
            if found_match:
                # Normalize format
                raw_number = found_match
                # Insert spaces for display if missing
                clean_number = raw_number.replace(" ", "").replace("\n", "").strip()
                
                if len(clean_number) == 12:
                     display_number = f"{clean_number[:4]} {clean_number[4:8]} {clean_number[8:]}"
                else: 
                     display_number = clean_number

                report["number_found"] = display_number
                
                # Check 1: Verhoeff Algorithm (Checksum)
                is_structurally_valid = self.validator.validate(clean_number)
                report["verhoeff_valid"] = is_structurally_valid
                
                # Check 2: Database Verification
                is_db_valid, db_msg = self.security.verify_uid(clean_number)
                report["db_valid"] = is_db_valid
                
                if is_structurally_valid and is_db_valid:
                    report["status"] = "Pass"
                    report["details"] = f"Valid Aadhaar Format & Verified in Database (ID: {display_number})"
                elif is_structurally_valid and not is_db_valid:
                    # Valid number format but not in our "Mock Database"
                    report["status"] = "Warn"
                    report["details"] = f"Structurally Valid ID ({display_number}), but not found in Demo Database. (This is expected for real cards)."
                else: 
                     report["status"] = "Fail"
                     report["details"] = f"Invalid Number Structure (Checksum Failed): {display_number}"
            
            else:
                report["status"] = "Fail" 
                report["details"] = f"Could not detect a clear 12-digit Aadhaar Number. Tried multiple enhancements."
                
        except Exception as e:
            report["status"] = "Error"
            report["details"] = str(e)
            
        return report
