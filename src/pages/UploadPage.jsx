import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import FileUploadZone from "../components/FileUploadZone";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { ArrowRight, Loader2, CheckCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { saveAnalysisHistory } from "../services/historyService";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    setLoading(true);
    setProgress(0);

    const fakeJobId = "JOB-" + Date.now(); // temporary jobId

    const interval = setInterval(async () => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          setSuccess(true);

          // ✅ SAVE HISTORY HERE
          saveAnalysisHistory({
            jobId: fakeJobId,
            fileName: selectedFile.name,
            result: "COMPLETED"
          });

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownload = () => {
    alert("Backend connected hone par yahan real PDF download hoga");
  };

  return (
    <>
      <Helmet>
        <title>Upload Document - Sicario</title>
      </Helmet>

      <div className="min-h-full p-10 bg-white text-black">
        <div className="max-w-4xl mx-auto">

          <h1 className="text-3xl font-bold mb-2 text-black">
            Upload Document for Analysis
          </h1>

          <p className="text-gray-600 mb-6">
            Upload an image or PDF to start forensic analysis
          </p>

          <div className="bg-white border border-gray-300 rounded-xl p-8">

            {!success && (
              <>
                <FileUploadZone onFileSelect={setSelectedFile} />

                {loading && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2 text-black">
                      <span>Uploading...</span>
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
                        Uploading...
                      </>
                    ) : (
                      <>
                        Start Analysis
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />

                <h2 className="text-2xl font-bold text-black mb-2">
                  Analysis Completed Successfully
                </h2>

                <p className="text-gray-600 mb-6">
                  Your document has been analyzed. Download the report below.
                </p>

                <div className="flex justify-center gap-4">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-4"
                    onClick={() => navigate("/history")}
                  >
                    View History
                  </Button>

                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4"
                    onClick={handleDownload}
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Report
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
