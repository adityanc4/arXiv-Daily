
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Paper } from './types';
import { fetchRecentPapers, fetchPapersByDate } from './services/arxivService';
import PaperNotification from './components/PaperNotification';
import StatusBar from './components/StatusBar';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import FilterBar from './components/FilterBar';

// Full, valid Base64 string for the background image
const backgroundImage = `url('data:image/jpeg;base64,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')`;

const groupPapersByDate = (papers: Paper[]): Record<string, Paper[]> => {
  const groups: Record<string, Paper[]> = {};
  
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  const yesterday = new Date(today);
  yesterday.setUTCDate(today.getUTCDate() - 1);

  papers.forEach(paper => {
    const paperPublishedDate = new Date(paper.published);

    const paperDate = new Date(Date.UTC(
      paperPublishedDate.getUTCFullYear(),
      paperPublishedDate.getUTCMonth(),
      paperPublishedDate.getUTCDate()
    ));
    
    let dateKey: string;
    if (paperDate.getTime() === today.getTime()) {
      dateKey = "Today";
    } else if (paperDate.getTime() === yesterday.getTime()) {
      dateKey = "Yesterday";
    } else {
      dateKey = paperDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'UTC' 
      });
    }

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(paper);
  });

  return groups;
};


const App: React.FC = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const mainRef = useRef<HTMLElement>(null);
  const [start, setStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageSize = 15;

  // Main data fetching effect, triggered by date filter changes
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        setPapers([]);
        setStart(0);
        setHasMore(true);
        mainRef.current?.scrollTo(0, 0);

        const fetcher = selectedDate
          ? fetchPapersByDate(selectedDate, 0, pageSize)
          : fetchRecentPapers(0, pageSize);
        
        const fetchedPapers = await fetcher;

        setPapers(fetchedPapers);
        setStart(pageSize);
        if (fetchedPapers.length < pageSize) {
          setHasMore(false);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [selectedDate]);

  // Auto-refresh effect for the latest feed
  useEffect(() => {
    if (selectedDate) return; // Don't auto-refresh if a date is selected

    const refreshInterval = setInterval(async () => {
      try {
        const latestPapers = await fetchRecentPapers(0, pageSize);
        setPapers(currentPapers => {
            const currentIds = new Set(currentPapers.map(p => p.id));
            const newPapers = latestPapers.filter(p => !currentIds.has(p.id));
            if (newPapers.length > 0) {
                return [...newPapers, ...currentPapers];
            }
            return currentPapers;
        });
      } catch (err) {
          console.error("Auto-refresh failed:", err);
      }
    }, 60000); // 1 minute

    return () => clearInterval(refreshInterval);
  }, [selectedDate]);

  const loadMorePapers = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    try {
      const fetcher = selectedDate 
        ? fetchPapersByDate(selectedDate, start, pageSize)
        : fetchRecentPapers(start, pageSize);
      
      const newPapers = await fetcher;

      if (newPapers.length > 0) {
        setPapers(prev => [...prev, ...newPapers]);
        setStart(prev => prev + pageSize);
      }
      if (newPapers.length < pageSize) {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load more papers", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [start, hasMore, isLoadingMore, selectedDate]);

  // Infinite scroll listener
  useEffect(() => {
    const element = mainRef.current;
    if (!element) return;

    const handleScroll = () => {
      if (element.scrollTop + element.clientHeight >= element.scrollHeight - 200) {
        loadMorePapers();
      }
    };
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [loadMorePapers]);

  const groupedPapers = useMemo(() => {
    if (selectedDate) {
        const dateKey = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
        return papers.length > 0 ? { [dateKey]: papers } : {};
    }
    return groupPapersByDate(papers);
  }, [papers, selectedDate]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <LoadingSpinner />
          <p className="mt-4 text-neutral-300">
            {selectedDate ? `Fetching papers for ${selectedDate.toLocaleDateString()}...` : 'Fetching latest papers...'}
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-center text-red-400 p-4">
          <p>Error: {error}</p>
        </div>
      );
    }
    
    if (papers.length === 0) {
        return (
          <div className="flex items-center justify-center h-full text-center text-neutral-300 p-4">
            <p>
              {selectedDate
                ? `No papers found for ${selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.`
                : 'Could not fetch any papers at the moment.'}
            </p>
          </div>
        );
    }

    return (
       <div className="p-3">
         {Object.entries(groupedPapers).map(([date, papersInGroup]) => (
           <div key={date} className="mb-6">
             <h2 className="text-xl font-bold text-[#ff4141] px-2 mb-3 sticky top-0 bg-black/50 backdrop-blur-sm py-2 z-10">{date}</h2>
             <div className="space-y-3">
               {papersInGroup.map((paper) => (
                 <PaperNotification key={paper.id} paper={paper} />
               ))}
             </div>
           </div>
         ))}
         {isLoadingMore && (
           <div className="flex justify-center py-4">
             <LoadingSpinner />
           </div>
         )}
         {!hasMore && papers.length > 0 && (
            <p className="text-center text-neutral-400 py-4">
              {selectedDate ? 'End of results for this date.' : 'No more papers to load.'}
            </p>
         )}
       </div>
    );
  };

  return (
    <div 
      className="w-[375px] h-[812px] bg-black/50 backdrop-blur-sm shadow-2xl shadow-[#ff4141]/20 overflow-hidden border-2 border-[#ff4141]/30 flex flex-col rounded-2xl"
      style={{
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <StatusBar />
      <Header />
      <FilterBar onDateChange={handleDateChange} isFiltering={!!selectedDate} />
      <main ref={mainRef} className="flex-grow overflow-y-auto scrollbar-hide relative">
        <div className="absolute inset-0 bg-black/30 -z-10"></div>
        {renderContent()}
      </main>
      <div className="h-8 bg-transparent flex items-center justify-center">
        <div className="w-32 h-1 bg-[#ff4141]/50 rounded-sm"></div>
      </div>
    </div>
  );
};

export default App;
