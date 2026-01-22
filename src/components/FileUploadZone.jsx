import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

const FileUploadZone = ({ onFileSelect, maxSize = 50 * 1024 * 1024, accept = '.pdf,.jpg,.jpeg,.png,.tiff' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff'];
    
    if (!allowedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload PDF, JPG, PNG, or TIFF files only.';
    }

    if (file.size > maxSize) {
      return `File size exceeds ${maxSize / (1024 * 1024)}MB limit.`;
    }

    return null;
  };

  const handleFile = useCallback((file) => {
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
    onFileSelect(file);
  }, [onFileSelect, maxSize]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-12 transition-all duration-300',
          isDragging
            ? 'border-forensic-blue bg-forensic-blue/5 scale-[1.02]'
            : 'border-gray-600 hover:border-forensic-blue/50 hover:bg-forensic-blue/5',
          error && 'border-red-500 bg-red-500/5'
        )}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept={accept}
          onChange={handleFileInput}
        />

        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-white font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-red-500" />
              </button>
            </motion.div>
          ) : (
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <motion.div
                animate={{
                  y: isDragging ? -10 : 0,
                }}
                className="w-16 h-16 bg-forensic-blue/10 rounded-full flex items-center justify-center mb-4"
              >
                <Upload className={cn(
                  'w-8 h-8 transition-colors',
                  isDragging ? 'text-forensic-blue' : 'text-gray-400'
                )} />
              </motion.div>
              
              <p className="text-lg font-medium text-white mb-2">
                {isDragging ? 'Drop your document here' : 'Drag & drop your document'}
              </p>
              <p className="text-sm text-gray-400 mb-4">or click to browse</p>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-forensic-blue/10 rounded-full text-xs text-gray-300">
                  PDF
                </span>
                <span className="px-3 py-1 bg-forensic-blue/10 rounded-full text-xs text-gray-300">
                  JPG
                </span>
                <span className="px-3 py-1 bg-forensic-blue/10 rounded-full text-xs text-gray-300">
                  PNG
                </span>
                <span className="px-3 py-1 bg-forensic-blue/10 rounded-full text-xs text-gray-300">
                  TIFF
                </span>
              </div>
              
              <p className="text-xs text-gray-500 mt-4">Maximum file size: 50MB</p>
            </motion.label>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;