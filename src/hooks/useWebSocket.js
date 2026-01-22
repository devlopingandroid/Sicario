import { useEffect, useRef, useCallback } from 'react';
import useAnalysisStore from "../store/analysisStore";
import { useToast } from "../components/ui/use-toast";

const useWebSocket = (jobId) => {
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  
  const { updateStage, addEventLog, setResults } = useAnalysisStore();
  const { toast } = useToast();

  const connect = useCallback(() => {
    if (!jobId || wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/job/${jobId}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttemptsRef.current = 0;
        addEventLog({
          type: 'system',
          message: 'Connected to processing server',
          level: 'info',
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Handle different event types
          switch (data.type) {
            case 'stage_update':
              updateStage(data.stage, {
                status: data.status,
                progress: data.progress,
                startTime: data.startTime || null,
                endTime: data.endTime || null,
              });
              addEventLog({
                type: 'stage',
                stage: data.stage,
                message: data.message || `${data.stage} ${data.status}`,
                level: 'info',
              });
              break;

            case 'progress':
              updateStage(data.stage, {
                progress: data.progress,
              });
              break;

            case 'result':
              setResults(data.results);
              addEventLog({
                type: 'result',
                message: 'Analysis complete',
                level: 'success',
              });
              break;

            case 'error':
              addEventLog({
                type: 'error',
                message: data.message,
                level: 'error',
              });
              toast({
                title: 'Processing Error',
                description: data.message,
                variant: 'destructive',
              });
              break;

            default:
              addEventLog({
                type: 'info',
                message: data.message || JSON.stringify(data),
                level: 'info',
              });
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        addEventLog({
          type: 'system',
          message: 'Connection error occurred',
          level: 'error',
        });
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            addEventLog({
              type: 'system',
              message: `Reconnecting... (attempt ${reconnectAttemptsRef.current})`,
              level: 'warning',
            });
            connect();
          }, delay);
        } else {
          addEventLog({
            type: 'system',
            message: 'Connection lost. Please refresh the page.',
            level: 'error',
          });
          toast({
            title: 'Connection Lost',
            description: 'Unable to reconnect. Please refresh the page.',
            variant: 'destructive',
          });
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to processing server',
        variant: 'destructive',
      });
    }
  }, [jobId, updateStage, addEventLog, setResults, toast]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (jobId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [jobId, connect, disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    disconnect,
    reconnect: connect,
  };
};

export default useWebSocket;