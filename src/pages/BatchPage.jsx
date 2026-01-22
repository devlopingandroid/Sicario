import React from 'react';
import { Helmet } from 'react-helmet';

function BatchPage() {
  return (
    <>
      <Helmet>
        <title>Batch Processing</title>
        <meta name="description" content="Process multiple documents in batch" />
      </Helmet>
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Batch Processing</h1>
          <p className="text-gray-600 mb-8">Upload and process multiple documents at once</p>
          <div className="bg-gray-50 rounded-lg p-12 border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Batch processing interface coming soon</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default BatchPage;