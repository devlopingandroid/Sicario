import { create } from 'zustand';

const useAnalysisStore = create((set, get) => ({
  currentJobId: null,
  uploadProgress: 0,
  processingStages: {
    OCR: { status: 'pending', progress: 0, startTime: null, endTime: null },
    CNN: { status: 'pending', progress: 0, startTime: null, endTime: null },
    ELA: { status: 'pending', progress: 0, startTime: null, endTime: null },
    Benford: { status: 'pending', progress: 0, startTime: null, endTime: null },
    Heatmap: { status: 'pending', progress: 0, startTime: null, endTime: null },
    Report: { status: 'pending', progress: 0, startTime: null, endTime: null },
  },
  eventLogs: [],
  results: null,
  batchJobs: [],

  setCurrentJobId: (jobId) => set({ currentJobId: jobId }),
  
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  
  updateStage: (stageName, updates) => set((state) => ({
    processingStages: {
      ...state.processingStages,
      [stageName]: {
        ...state.processingStages[stageName],
        ...updates,
      },
    },
  })),

  addEventLog: (event) => set((state) => ({
    eventLogs: [
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...event,
      },
      ...state.eventLogs,
    ].slice(0, 100), // Keep last 100 events
  })),

  setResults: (results) => set({ results }),

  addBatchJob: (job) => set((state) => ({
    batchJobs: [...state.batchJobs, job],
  })),

  updateBatchJob: (batchId, updates) => set((state) => ({
    batchJobs: state.batchJobs.map((job) =>
      job.batchId === batchId ? { ...job, ...updates } : job
    ),
  })),

  resetJob: () => set({
    currentJobId: null,
    uploadProgress: 0,
    processingStages: {
      OCR: { status: 'pending', progress: 0, startTime: null, endTime: null },
      CNN: { status: 'pending', progress: 0, startTime: null, endTime: null },
      ELA: { status: 'pending', progress: 0, startTime: null, endTime: null },
      Benford: { status: 'pending', progress: 0, startTime: null, endTime: null },
      Heatmap: { status: 'pending', progress: 0, startTime: null, endTime: null },
      Report: { status: 'pending', progress: 0, startTime: null, endTime: null },
    },
    eventLogs: [],
    results: null,
  }),

  getEstimatedTime: () => {
    const stages = get().processingStages;
    const completedStages = Object.values(stages).filter(s => s.status === 'completed');
    const totalStages = Object.keys(stages).length;
    
    if (completedStages.length === 0) return null;
    
    const avgTime = completedStages.reduce((sum, stage) => {
      if (stage.startTime && stage.endTime) {
        return sum + (new Date(stage.endTime) - new Date(stage.startTime));
      }
      return sum;
    }, 0) / completedStages.length;

    const remainingStages = totalStages - completedStages.length;
    return Math.round((avgTime * remainingStages) / 1000); // Return in seconds
  },
}));

export default useAnalysisStore;