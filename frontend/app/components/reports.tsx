'use client';

import React, { useState } from 'react';
import api from '../utils/api';

const Reports: React.FC = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [reportData, setReportData] = useState<any | null>(null); // Adjusted to accept any type of data
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await api.post('/reports/', {});
      console.log(response);
      setReportData(null); // Clear previous report data
      alert('Report generation started. Check back in a few moments!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await api.get('/reports/');
      setReportData(response); // Store the report data to display

      // Download the report as JSON file
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'library_report.json';
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download the latest report.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Library Reports</h2>

      <div className="flex flex-col items-center gap-6">
        {/* Generate Report Button */}
        <button
          onClick={generateReport}
          disabled={loading}
          className={`px-6 py-2 text-white rounded-lg ${
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>

        {/* Download Report Button */}
        <button
          onClick={downloadReport}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Download Latest Report
        </button>

        {/* Report Data Preview */}
        {reportData && (
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 shadow-md rounded-lg w-full max-w-3xl">
            <h3 className="text-lg font-semibold mb-4 text-center">Latest Report Data</h3>
            <pre className="text-sm overflow-auto whitespace-pre-wrap">
              {JSON.stringify(reportData, null, 2)} {/* Display JSON data here */}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
