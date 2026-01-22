import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';

function ResultsPage() {
  const { jobId } = useParams();

  return (
    <>
      <Helmet>
        <title>Processing Results</title>
        <meta name="description" content="View document processing results" />
      </Helmet>
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Processing Results</h1>
          <p className="text-gray-600 mb-8">Job ID: {jobId}</p>
          <div className="bg-gray-50 rounded-lg p-12 border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Results display interface coming soon</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultsPage;