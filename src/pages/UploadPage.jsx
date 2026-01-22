import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import FileUploadZone from "../components/FileUploadZone";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { ArrowRight, Loader2, CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { saveAnalysisHistory } from "../services/historyService";

const UploadPage = () => {
  const { docType } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [report, setReport] = useState(null);

  const navigate = useNavigate();

  // Dynamic UI Text based on Route
  const getPageContent = () => {
    switch (docType) {
      case 'aadhaar':
        return {
          title: "Aadhaar OCR Verification",
          desc: "Upload Aadhaar card (front/back) to detect tampering & verify OCR data.",
          btnText: "Start Aadhaar Analysis"
        };
      case 'bills':
        return {
          title: "Fake Bills Verification",
          desc: "Upload invoice or receipt to detect digital manipulation.",
          btnText: "Start Bill Analysis"
        };
      case 'marksheet':
      default:
        return {
          title: "Marksheets Verification",
          desc: "Upload academic marksheet to verify authenticity.",
          btnText: "Start Forensic Analysis"
        };
    }
  };

  const content = getPageContent();

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      // We can pass docType to backend later if logic diverges
      formData.append('doc_type', docType || 'marksheet');

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      const response = await axios.post('http://localhost:5000/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(interval);
      setProgress(100);
      setReport(response.data);
      setSuccess(true);
      setLoading(false);

      const fakeJobId = "JOB-" + Date.now();
      saveAnalysisHistory({
        jobId: fakeJobId,
        fileName: selectedFile.name,
        result: response.data.checks?.Logic?.status || "Analyzing",
        date: new Date().toLocaleDateString(),
        type: docType
      });

    } catch (error) {
      console.error("Upload failed", error);
      alert("Analysis failed. Ensure backend is running.");
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{content.title} - Sicario</title>
      </Helmet>

      <div className="min-h-full p-10 bg-white text-black">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold mb-2 text-black">
            {content.title}
          </h1>

          <p className="text-gray-600 mb-6">
            {content.desc}
          </p>

          <div className="bg-white border border-gray-300 rounded-xl p-8 shadow-sm">

            {!success && (
              <>
                <FileUploadZone onFileSelect={setSelectedFile} />

                {loading && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2 text-black">
                      <span>Analyzing...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={handleUpload}
                    disabled={!selectedFile || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {content.btnText}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {success && report && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-black mb-2">
                  Analysis Complete
                </h2>

                <div className="text-left bg-gray-50 p-6 rounded-lg border my-6">
                  <h3 className="font-bold text-lg mb-4">Summary Report</h3>
                  <div className="space-y-4">
                    {Object.entries(report.checks).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-semibold">{key}</p>
                          <p className="text-sm text-gray-600">{value.details}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${value.status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {value.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {report.security && (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                        <span className="text-green-600">🔒 Security Layer Verified</span>
                      </h4>
                      <div className="bg-blue-50 p-4 rounded text-sm text-gray-700 space-y-2">
                        <p><b>Certificate ID:</b> {report.security.cert_id}</p>
                        <p className="break-all"><b>SHA-256 Hash:</b> {report.security.file_hash}</p>

                        <a href={report.security.cert_url} target="_blank" rel="noopener noreferrer">
                          <Button className="mt-2 bg-green-700 hover:bg-green-800 text-white w-full">
                            <Download className="w-4 h-4 mr-2" /> Download Secure Certificate
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}

                  {report.ela_url && (
                    <div className="mt-6">
                      <p className="font-semibold mb-2">Error Level Analysis (ELA) Visualization:</p>
                      <img src={report.ela_url} alt="ELA Result" className="w-full max-w-md mx-auto border rounded" />
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-4"
                    onClick={() => { setSuccess(false); setSelectedFile(null); setReport(null); }}
                  >
                    Analyze Another
                  </Button>

                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4"
                    onClick={() => navigate("/history")}
                  >
                    View History
                  </Button>
                </div>
              </motion.div>
            )}

          </div>

        </div>
      </div>
    </>
  );
};

export default UploadPage;
