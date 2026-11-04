import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { initGlobalErrorMonitoring } from './utils/monitor.ts';
import './index.css';

// Initialize non-intrusive client error monitoring
initGlobalErrorMonitoring();

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
