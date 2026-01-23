<div align="center">

  <img src="./src/assets/process.png" alt="Sicario Logo" width="120" />
  
  <br />
  
  # 🛡️ S I C A R I O
  
  **Next-Gen AI Document Forensic & Forgery Detection Platform**
  
  <p>
    <b>Detect. Analyze. Verify.</b> <br />
    Unveiling the truth behind digital documents using State-of-the-Art Deep Learning & Computer Vision.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Backend-Flask_Python-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
    <img src="https://img.shields.io/badge/AI_Model-TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow" />
    <img src="https://img.shields.io/badge/Vision-OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" alt="OpenCV" />
    <img src="https://img.shields.io/badge/Auth-Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white" alt="Firebase" />
  </p>

  <br />

  <a href="#-demo"><strong>View Demo</strong></a> · 
  <a href="#-installation--setup"><strong>Installation</strong></a> · 
  <a href="#-api-endpoints"><strong>API Docs</strong></a> · 
  <a href="https://github.com/yourusername/sicario/issues"><strong>Report Bug</strong></a>

</div>

<br />

---

## 📸 UI Showcase

> *A sneak peek into the forensic laboratory.*

<div align="center">
  <img src="https://via.placeholder.com/800x400.png?text=Place+Your+Dashboard+Screenshot+Here" alt="Dashboard Preview" width="800" />
</div>

---

## 🔍 Overview

**Sicario** is an advanced forensic toolkit designed to verify the authenticity of digital documents. In an era of AI-generated content and Photoshop manipulation, Sicario acts as the gatekeeper.

It utilizes a multi-layered pipeline:
1.  **Visual Layer:** ELA (Error Level Analysis) for compression artifacts.
2.  **Deep Layer:** CNNs (EfficientNet) for texture & noise inconsistency.
3.  **Geometric Layer:** OCR for pixel-perfect text alignment checks.

---

## ✨ Key Features

| 🧠 AI & Deep Learning | 👀 Computer Vision |
| :--- | :--- |
| **EfficientNet-B0 Backbone:** Extracts deep feature maps to find copy-move forgery. | **ELA (Error Level Analysis):** Highlights manipulated JPEG compression rates. |
| **Noise Variance Analysis:** Detects "smooth" patches indicating digital wiping. | **RSID (Region Duplication):** Identifies cloned areas in a document. |

| ⚡ Modern Architecture | 📄 Geometric & OCR |
| :--- | :--- |
| **Real-time Processing:** WebSocket-style updates for immediate feedback. | **Text Alignment Check:** Detects floating text inserted post-scan. |
| **Secure Cloud Storage:** Firebase integration for user history & auth. | **Metadata Audit:** Scans EXIF data for editing software traces. |

---

## 🏗️ System Architecture

A robust decoupled architecture ensures scalability and security.

```mermaid
graph LR
    User((User)) --> A[Frontend React]
    A -->|Auth| B[Firebase]
    A -->|Upload Document| C[Python Flask API]
    
    subgraph "Forensic Engine"
    C --> D[Preprocessing]
    D --> E[ELA Analysis]
    D --> F[EfficientNet CNN]
    D --> G[OCR Tesseract]
    end
    
    E & F & G --> H[Fusion Logic]
    H -->|Verdict: Forged/Real| A
    H -->|Save Report| I[Firestore DB]
🛠️ Tech Stack
Frontend (The Face)
Tech	Description
React.js (Vite)	Blazing fast UI framework.
Tailwind CSS	Modern utility-first styling.
Framer Motion	Smooth animations.
Zustand	Lightweight state management.

Export to Sheets

Backend (The Brain)
Tech	Description
Flask	Lightweight Python server.
TensorFlow	Deep Learning core (EfficientNet).
OpenCV	Image processing & ELA.
Tesseract	Optical Character Recognition.

Export to Sheets

🚀 Installation & Setup
Follow these steps to set up the laboratory locally.

Prerequisites
Node.js (v16+)

Python (v3.8+)

Tesseract OCR (sudo apt install tesseract-ocr or Win installer)

1️⃣ Clone the Repository
Bash

git clone [https://github.com/your-username/sicario.git](https://github.com/your-username/sicario.git)
cd sicario
2️⃣ Backend Setup
Bash

cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python app.py
🔥 Server running at: http://localhost:5001

3️⃣ Frontend Setup
Bash

cd frontend
npm install
npm run dev
💻 Client running at: http://localhost:3000

🔌 API Endpoints
<details> <summary>👆 <b>Click to expand API Documentation</b></summary>

Method	Endpoint	Description
POST	/api/analyze	Accepts file form-data. Returns analysis JSON + Image Paths.
GET	/api/result/<filename>	Serves the generated heatmap images.
GET	/health	Checks if the ML engine is ready.

Export to Sheets

</details>

👥 The Team
<div align="center"> <b>Built with ❤️ by Team Sicario</b> <br /> <i>"Truth is hidden in the pixels."</i> </div>

📜 License
Distributed under the MIT License. See LICENSE for more information.

<div align="center"> <img src="https://www.google.com/search?q=https://capsule-render.vercel.app/api%3Ftype%3Dwaving%26color%3D000000%26height%3D100%26section%3Dfooter" /> </div>
