import React, { useState } from 'react';
import { FiRefreshCw, FiClock } from 'react-icons/fi';
import { useDashboard } from '../context/DashboardContext';

interface RefreshControlsProps {
  className?: string;
  pageRefresh?: () => Promise<void>; 
}

const RefreshControls: React.FC<RefreshControlsProps> = ({ className = "", pageRefresh }) => {
  const { isRefreshing, lastRefreshTime } = useDashboard();
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <button
        onClick={async () => {
          // Manual refresh triggered
          if (pageRefresh && !isManualRefreshing) {
            setIsManualRefreshing(true);
            try {
              await pageRefresh();
            } catch (error) {
              console.error('Manual refresh failed:', error);
            } finally {
              setIsManualRefreshing(false);
            }
          }
        }}
        className="px-3 py-1.5 bg-gradient-to-r from-[#0B4073] to-[#1a5490] text-white rounded-lg text-xs font-medium hover:shadow-lg flex items-center transition-all duration-200 transform hover:-translate-y-0.5"
        title="Manual refresh"
      >
        <FiRefreshCw className={`mr-1 w-3 h-3 ${isManualRefreshing || isRefreshing ? 'animate-spin' : ''}`} />
        {isManualRefreshing || isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );
};
export default RefreshControls;
