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
    <img src="https://img.shields.io/badge/Frontend-React_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
    <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/Backend-Flask_Python-000000?style=for-the-badge&logo=flask&logoColor=white" />
    <img src="https://img.shields.io/badge/AI_Model-TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" />
    <img src="https://img.shields.io/badge/Vision-OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" />
    <img src="https://img.shields.io/badge/Auth-Firebase-039BE5?style=for-the-badge&logo=firebase&logoColor=white" />
  </p>

  <a href="#-demo"><strong>View Demo</strong></a> · 
  <a href="#-installation--setup"><strong>Installation</strong></a> · 
  <a href="#-api-endpoints"><strong>API Docs</strong></a> · 
  <a href="https://github.com/yourusername/sicario/issues"><strong>Report Bug</strong></a>

</div>

---

## 📸 UI Showcase

> A sneak peek into the forensic laboratory.

<div align="center">
  <img src="https://via.placeholder.com/900x450.png?text=Sicario+Dashboard+Preview" width="900"/>
</div>

---

## 🔍 Overview

**Sicario** is an AI-powered forensic toolkit designed to verify the authenticity of digital documents such as invoices, certificates, ID cards, and legal records.

In the era of AI-generated images and advanced Photoshop manipulation, Sicario provides multi-layer verification using:

- Computer Vision
- Deep Learning
- OCR Geometry Analysis
- Metadata Inspection

---

## ✨ Key Features

### 🧠 AI & Deep Learning
- EfficientNet-based deep feature extraction
- Texture & noise inconsistency detection
- CNN-based authenticity scoring

### 👀 Computer Vision
- Error Level Analysis (ELA)
- Region duplication detection (copy-move)
- Compression artifact visualization

### 📄 Geometric & OCR
- Text alignment consistency checks
- Font & spacing anomaly detection
- OCR-based structure validation

### ⚡ System
- Real-time processing
- Secure Firebase authentication
- History & report storage
- JSON forensic reports

---

## 🏗️ System Architecture

```mermaid
graph LR
    User((User)) --> A[Frontend - React]
    A -->|Auth| B[Firebase]
    A -->|Upload Document| C[Flask API]

    subgraph Forensic_Engine
        C --> D[Preprocessing]
        D --> E[ELA Analysis]
        D --> F[EfficientNet CNN]
        D --> G[OCR Engine]
        E --> H[Fusion Logic]
        F --> H
        G --> H
    end
```

### 🛠️ Tech Stack
Frontend (The Face)
Tech	Description
React (Vite)	High performance UI
Tailwind CSS	Utility-first styling
Framer Motion	Animations
Zustand	State management
Backend (The Brain)
Tech	Description
Flask	REST API
TensorFlow	Deep learning
OpenCV	Image processing
Tesseract OCR	Text extraction
Firebase	Auth & storage
🚀 Installation & Setup
Prerequisites

Node.js v16+

Python 3.8+

Tesseract OCR

1️⃣ Clone Repository
git clone https://github.com/your-username/sicario.git
cd sicario

2️⃣ Backend Setup
cd backend
python -m venv venv

---

# Activate
venv\Scripts\activate      # Windows
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
python app.py

Server:
👉 http://localhost:5001

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Client:
👉 http://localhost:3000

---

### 🔌 API Endpoints
Method	Endpoint	Body	Description
POST	/api/analyze	file	Analyze document
GET	/api/result/:filename	–	Get heatmap
GET	/health	–	Server health

---

### 🔐 Security & Auth
Authentication: All protected routes (/upload, /history) require a valid Firebase session.

Data Isolation: Users can only view the history of documents they uploaded.

Privacy: Uploaded files are processed in a temporary sandbox and typically wiped after the session (configurable).

---

### 🤝 Contributing
Fork the repository.

Create your feature branch (git checkout -b feature/AmazingFeature).

Commit your changes (git commit -m 'Add some AmazingFeature').

Push to the branch (git push origin feature/AmazingFeature).

Open a Pull Request.

---

### 👥 Team
<div align="center"> <b>Team Sicario</b><br/> <i>"Truth is hidden in the pixels."</i> </div>
