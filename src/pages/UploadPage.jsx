import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import FileUploadZone from "../components/FileUploadZone";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { ArrowRight, Loader2 } from 'lucide-react';
import useApi from "../hooks/useApi";
import useAnalysisStore from "../store/analysisStore";
import { motion } from 'framer-motion';
import { useToast } from "../components/ui/use-toast";

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const { uploadDocument, loading } = useApi();
  const { uploadProgress, setUploadProgress, setCurrentJobId } = useAnalysisStore();
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select a document to analyze',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await uploadDocument(selectedFile, setUploadProgress);
      
      if (response.job_id) {
        setCurrentJobId(response.job_id);
        toast({
          title: 'Upload Successful',
          description: `Job ID: ${response.job_id}`,
        });
        navigate(`/dashboard/${response.job_id}`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Upload Document - Sicario-Forensic Document Analyzer</title>
        <meta name="description" content="Upload documents for forensic analysis using advanced AI and machine learning techniques" />
      </Helmet>

      {/* Force white background & black text everywhere */}
      <div className="min-h-full p-8 bg-white text-black [&_*]:text-black">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                Upload Document for Analysis
              </h1>
              <p className="text-gray-600">
                Upload a document to begin forensic analysis using our advanced AI detection system
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-300">
              <FileUploadZone onFileSelect={setSelectedFile} />

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Uploading...</span>
                    <span className="text-sm font-medium">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </motion.div>
              )}

              <div className="mt-8 flex justify-end">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
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
            </div>

            <div className="mt-8 grid grid-cols-4 gap-4">
              {[
                { title: 'OCR Analysis', desc: 'Text extraction and verification' },
                { title: 'CNN Detection', desc: 'Deep learning forgery detection' },
                { title: 'ELA Analysis', desc: 'Error level analysis for tampering' },
                { 
                  title: 'RSID Verification', 
                  desc: 'Detects copy–move and duplicated regions to identify reused or manipulated document areas' 
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white border border-gray-300 rounded-lg p-4"
                >
                  <h3 className="font-semibold mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
