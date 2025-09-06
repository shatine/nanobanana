import React from 'react';

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m1-9l2.293 2.293a1 1 0 01-1.414 1.414L10 10m-2 7l-2.293-2.293a1 1 0 011.414-1.414L10 17m11-9l-2.293 2.293a1 1 0 01-1.414-1.414L18 10m-2 7l2.293-2.293a1 1 0 011.414 1.414L18 17" />
    </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const PaintBrushIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M18.51 7.854a3.375 3.375 0 00-4.773 0l-1.29 1.29a.75.75 0 01-1.06 0l-3.37-3.37a.75.75 0 010-1.06l1.29-1.29a3.375 3.375 0 00-4.774-4.773L.913 8.16a.75.75 0 000 1.06l3.37 3.37a.75.75 0 010 1.06l-1.29 1.29a3.375 3.375 0 000 4.773l4.184 4.183a.75.75 0 001.06 0l10.8-10.8a3.375 3.375 0 000-4.773z" />
    </svg>
);

export const EraserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M9.443 2.23a.75.75 0 011.114 0l8.25 8.25a.75.75 0 010 1.114l-8.25 8.25a.75.75 0 01-1.114 0L1.193 11.6a.75.75 0 010-1.114l8.25-8.25zM11.25 10.155l-1.92 1.92a.75.75 0 000 1.06l3.07 3.07a.75.75 0 001.06 0l1.92-1.92a.75.75 0 000-1.06l-3.07-3.07a.75.75 0 00-1.06 0z" clipRule="evenodd" />
    <path d="M22.5 11.6a.75.75 0 01-.75-.75V8.25a.75.75 0 011.5 0v2.6a.75.75 0 01-.75.75z" />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

export const LockClosedIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25a3.75 3.75 0 017.5 0v3h-7.5v-3z" clipRule="evenodd" />
    </svg>
);

export const LockOpenIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12.75 1.5a5.25 5.25 0 00-5.25 5.25v3h-1.5a.75.75 0 000 1.5h13.5a.75.75 0 000-1.5h-1.5v-3A5.25 5.25 0 0012.75 1.5z" />
        <path fillRule="evenodd" d="M9 12.75a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3H9zm3.75 3.75a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" clipRule="evenodd" />
    </svg>
);