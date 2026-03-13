'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ManualCsvUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessage(null);

    try {
      // Create FormData to send to our webhook endpoint
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/webhooks/inbound-email', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: data.message });
        router.refresh(); // Refresh the page to show latest sync logs
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to process CSV' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Network error occurred' });
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Manual CSV Fallback</h4>
      <p className="text-xs text-slate-500 mb-4">
        Directly upload a standard CSV payload to test ingestion parsing without needing an external email provider to trigger the webhook.
      </p>
      
      <div className="flex items-center gap-4">
        <label className={`
          relative flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold rounded-lg cursor-pointer transition-colors
          ${isUploading 
            ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' 
            : 'bg-primary text-white hover:bg-primary/90 shadow-sm'
          }
        `}>
          <span className="material-symbols-outlined text-sm">
            {isUploading ? 'hourglass_top' : 'upload_file'}
          </span>
          {isUploading ? 'Processing...' : 'Upload CSV'}
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
        
        {message && (
          <span className={`text-xs font-semibold ${message.type === 'success' ? 'text-primary' : 'text-red-500'}`}>
            {message.text}
          </span>
        )}
      </div>
    </div>
  );
}
