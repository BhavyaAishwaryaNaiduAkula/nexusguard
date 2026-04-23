/**
 * History Manager for Log Analyses
 * Handles persistence of past results in localStorage.
 */

const STORAGE_KEY = 'nexusguard_analysis_history';
const MAX_HISTORY = 10;

export const saveAnalysis = (logs, result) => {
  try {
    const history = getHistory();
    const newEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      logs: logs.substring(0, 1000), // Limit log size in storage
      result,
    };

    const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Failed to save to history:', error);
    return [];
  }
};

export const getHistory = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
};

export const deleteAnalysis = (id) => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Failed to delete history item:', error);
    return getHistory();
  }
};
