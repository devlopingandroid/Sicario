import React from 'react';
import { CheckCircle2, Loader2, Clock, AlertCircle } from 'lucide-react';
import { Progress } from "./ui/progress";
import { cn } from "../lib/utils";
import { motion } from 'framer-motion';

const StageProgressBar = ({ stageName, status, progress, startTime, endTime }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 border-green-500/30';
      case 'processing':
        return 'bg-blue-500/10 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/10 border-red-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  const getDuration = () => {
    if (startTime && endTime) {
      const duration = (new Date(endTime) - new Date(startTime)) / 1000;
      return `${duration.toFixed(1)}s`;
    }
    if (startTime && status === 'processing') {
      const duration = (new Date() - new Date(startTime)) / 1000;
      return `${duration.toFixed(1)}s`;
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'p-4 rounded-lg border transition-all duration-300',
        getStatusColor()
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-white">{stageName}</h3>
            <p className="text-xs text-gray-400 capitalize">{status}</p>
          </div>
        </div>
        {getDuration() && (
          <span className="text-sm text-gray-400">{getDuration()}</span>
        )}
      </div>

      {(status === 'processing' || progress > 0) && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StageProgressBar;