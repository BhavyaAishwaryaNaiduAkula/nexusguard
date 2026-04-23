import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import LogInput from './components/LogInput';
import SkeletonResult from './components/SkeletonResult';
import ResultPanel from './components/ResultPanel';
import AnalysisHistory from './components/AnalysisHistory';
import { analyzeLogs } from './services/api';
import { saveAnalysis, getHistory, deleteAnalysis } from './utils/historyManager';
import { AuthProvider } from './context/AuthContext';
import { WorkflowProvider } from './context/WorkflowContext';
import ProtectedRoute from './components/ProtectedRoute';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("NexusGuard Runtime Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
          <div className="card max-w-md p-8 border-red-500/20">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-brand font-bold text-white mb-2 uppercase tracking-tighter">System Malfunction</h2>
            <p className="text-slate-400 text-sm mb-6">A critical runtime error has occurred in the UI layer.</p>
            <div className="bg-black/50 p-4 rounded-xl mb-6 text-left overflow-auto max-h-48 border border-white/5">
              <p className="text-[10px] font-mono text-red-400 leading-relaxed whitespace-pre-wrap">
                {this.state.error?.toString()}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary w-full text-xs uppercase tracking-widest"
            >
              Reboot Interface
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy Loaded Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Pipelines = lazy(() => import('./pages/Pipelines'));
const Clusters = lazy(() => import('./pages/Clusters'));
const Observability = lazy(() => import('./pages/Observability'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));

const AccessControl = lazy(() => import('./pages/AccessControl'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center">
    <div className="w-12 h-12 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin mb-4"></div>
    <p className="text-xs font-mono text-brand-400 animate-pulse uppercase tracking-widest">Loading Component...</p>
  </div>
);

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const MainDashboard = ({ 
  handleAnalyzeLogs, 
  isAnalyzing, 
  analysisResult, 
  error, 
  resultsRef, 
  history, 
  handleViewHistory, 
  handleDeleteHistory,
  setAnalysisResult 
}) => (
  <div className="space-y-12">
    <section className="flex flex-col gap-8 w-full">
      <div className="w-full transition-all duration-300">
        <LogInput onAnalyze={handleAnalyzeLogs} isLoading={isAnalyzing} />
      </div>

      <div ref={resultsRef} className="w-full scroll-mt-6 transition-all duration-500">
        {isAnalyzing && <SkeletonResult />}
        
        {error && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="p-4 border border-red-500/30 bg-red-500/10 rounded-lg w-full text-center"
           >
              <p className="text-red-400 text-sm font-mono">{error}</p>
           </motion.div>
        )}
        
        {!isAnalyzing && analysisResult && (
           <ResultPanel result={analysisResult} onClear={() => setAnalysisResult(null)} />
        )}
      </div>
    </section>

    <hr className="border-brand-500/10 shadow-[0_1px_10px_rgba(99,102,241,0.1)]" />

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2">
        <Dashboard />
      </div>
      <div>
        <AnalysisHistory 
          history={history} 
          onView={handleViewHistory}
          onDelete={handleDeleteHistory}
        />
      </div>
    </div>
  </div>
);

function AppContent() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    if ((analysisResult || error) && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [analysisResult, error]);

  const handleAnalyzeLogs = async (logs) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeLogs(logs);
      setAnalysisResult(result);
      const updatedHistory = saveAnalysis(logs, result);
      setHistory(updatedHistory);
      toast.success('Log analysis complete!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewHistory = (item) => {
    setAnalysisResult(item.result);
    toast.success('Previous analysis loaded', { icon: '📁' });
  };

  const handleDeleteHistory = (id) => {
    const updatedHistory = deleteAnalysis(id);
    setHistory(updatedHistory);
    toast('History item removed', { icon: '🗑️' });
  };

  const dashboardProps = {
    handleAnalyzeLogs,
    isAnalyzing,
    analysisResult,
    error,
    resultsRef,
    history,
    handleViewHistory,
    handleDeleteHistory,
    setAnalysisResult
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 transition-colors duration-500">
      <Toaster position="top-right" />
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <AnimatePresence mode="wait">
          <Suspense fallback={<PageLoader />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
              <Route path="/" element={<PageTransition><MainDashboard {...dashboardProps} /></PageTransition>} />
              <Route path="/pipelines" element={<PageTransition><Pipelines /></PageTransition>} />
              <Route path="/clusters" element={<PageTransition><Clusters /></PageTransition>} />
              <Route path="/observability" element={<PageTransition><Observability /></PageTransition>} />
              <Route path="/access-control" element={<PageTransition><AccessControl /></PageTransition>} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>

      <footer className="w-full border-t border-white/5 bg-[#020617]/80 backdrop-blur-md py-12 mt-auto text-center shrink-0">
        <p className="text-[10px] text-brand-500/40 tracking-[0.3em] font-brand uppercase">
          NEXUSGUARD &copy; {new Date().getFullYear()} // AUTONOMOUS DEVOPS ECOSYSTEM
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WorkflowProvider>
          <Router>
            <AppContent />
          </Router>
        </WorkflowProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
