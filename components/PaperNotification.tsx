
import React from 'react';
import { Paper } from '../types';

interface PaperNotificationProps {
  paper: Paper;
}

const PaperIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#ff4141]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);


const PaperNotification: React.FC<PaperNotificationProps> = ({ paper }) => {
  const primaryAuthor = paper.authors.length > 0 ? paper.authors[0] : 'Unknown Author';

  const publishedTime = new Date(paper.published).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
    hour12: false,
  });

  return (
    <div className="bg-black/40 backdrop-blur-sm p-4 shadow-lg border border-[#ff4141]/30 flex flex-col justify-between">
      <div>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <PaperIcon />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-[#ff4141]">New Paper</span>
              <span className="text-xs text-neutral-400">
                {publishedTime} UTC
              </span>
            </div>
            <p className="text-md font-bold text-white mt-1 leading-tight">
              {paper.title}
            </p>
            <p className="text-sm text-neutral-300 mt-1">
              By {primaryAuthor} et al.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {paper.categories.slice(0, 3).map(cat => (
                <span key={cat} className="text-xs bg-[#ff4141]/20 text-red-300 px-2 py-1">{cat}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#ff4141]/30">
        <a
          href={paper.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full block text-center bg-[#ff4141] hover:bg-[#e03535] text-white font-semibold py-2 px-4 transition-colors duration-200"
        >
          View PDF
        </a>
      </div>
    </div>
  );
};

export default PaperNotification;
