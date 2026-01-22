import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import useWebSocket from "../hooks/useWebSocket";
import useAnalysisStore from "../store/analysisStore";
import StageProgressBar from "../components/StageProgressBar";
import EventLog from "../components/EventLog";
import { motion } from 'framer-motion';
import { Clock, Wifi, WifiOff } from 'lucide-react';

const DashboardPage = () => {
  const { jobId } = useParams();
  const { processingStages, eventLogs, getEstimatedTime, setCurrentJobId } = useAnalysisStore();
  const { isConnected } = useWebSocket(jobId);

  useEffect(() => {
    if (jobId) {
      setCurrentJobId(jobId);
    }
  }, [jobId, setCurrentJobId]);

  const estimatedTime = getEstimatedTime();

  const stageOrder = ['OCR', 'CNN', 'ELA', 'Benford', 'Heatmap', 'Report'];

  return (
    <>
      <Helmet>
        <title>Processing Dashboard - Sicario</title>
        <meta name="description" content="Real-time forensic document analysis processing dashboard" />
      </Helmet>

      <div className="min-h-full p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Processing Dashboard</h1>
                <div className="flex items-center gap-4">
                  <p className="text-gray-400">Job ID: <span className="text-white font-mono">{jobId}</span></p>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    isConnected ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                    <span className="text-xs font-medium">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>

              {estimatedTime && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-forensic-blue/10 border border-forensic-blue/30 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Estimated Time Remaining</p>
                      <p className="text-xl font-bold text-white">{estimatedTime}s</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Processing Stages</h2>
                {stageOrder.map((stageName, index) => (
                  <motion.div
                    key={stageName}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <StageProgressBar
                      stageName={stageName}
                      {...processingStages[stageName]}
                    />
                  </motion.div>
                ))}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Live Events</h2>
                <EventLog events={eventLogs} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;