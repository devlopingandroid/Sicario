import React, { useRef, useEffect } from 'react';
import { Terminal, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from "../lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

const EventLog = ({ events }) => {
  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 0;
    }
  }, [events]);

  const getEventIcon = (level) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getEventColor = (level) => {
    switch (level) {
      case 'success':
        return 'border-l-green-500 bg-green-500/5';
      case 'error':
        return 'border-l-red-500 bg-red-500/5';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-500/5';
      default:
        return 'border-l-blue-500 bg-blue-500/5';
    }
  };

  return (
    <div className="bg-forensic-charcoal-light rounded-lg border border-forensic-blue/30 overflow-hidden">
      <div className="bg-forensic-blue/10 px-4 py-3 border-b border-forensic-blue/30 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-white">Event Log</span>
        <span className="ml-auto text-xs text-gray-400">{events.length} events</span>
      </div>

      <div
        ref={logRef}
        className="h-96 overflow-y-auto p-4 space-y-2 font-mono text-sm"
      >
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'border-l-2 pl-3 py-2 rounded-r',
                getEventColor(event.level)
              )}
            >
              <div className="flex items-start gap-2">
                {getEventIcon(event.level)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                    {event.stage && (
                      <span className="text-xs px-2 py-0.5 bg-forensic-blue/20 rounded text-blue-400">
                        {event.stage}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-xs break-words">{event.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p className="text-sm">No events yet. Upload a document to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventLog;