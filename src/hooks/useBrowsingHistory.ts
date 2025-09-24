import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface HistoryEntry {
  path: string;
  title: string;
  timestamp: Date;
}

const HISTORY_KEY = 'portfolio_browsing_history';
const MAX_HISTORY_ENTRIES = 50;

const getPageTitle = (path: string): string => {
  switch (path) {
    case '/':
      return 'Home';
    case '/auth':
      return 'Login / Signup';
    case '/dashboard':
      return 'Dashboard';
    case '/history':
      return 'Browsing History';
    default:
      return path.replace('/', '').replace('-', ' ') || 'Unknown Page';
  }
};

export const useBrowsingHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Load history from localStorage on mount
    const savedHistory = localStorage.getItem(HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setHistory(parsed);
      } catch (error) {
        console.error('Failed to parse browsing history:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Track current page visit
    const currentPath = location.pathname;
    const title = getPageTitle(currentPath);
    
    setHistory(prevHistory => {
      // Don't add duplicate consecutive entries
      const lastEntry = prevHistory[0];
      if (lastEntry && lastEntry.path === currentPath) {
        return prevHistory;
      }

      const newEntry: HistoryEntry = {
        path: currentPath,
        title,
        timestamp: new Date()
      };

      const updatedHistory = [newEntry, ...prevHistory].slice(0, MAX_HISTORY_ENTRIES);
      
      // Save to localStorage
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Failed to save browsing history:', error);
      }

      return updatedHistory;
    });
  }, [location.pathname]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return {
    history,
    clearHistory
  };
};