
// This file remains for backwards compatibility
// The main entry point is now handled by Next.js in app/layout.tsx and app/page.tsx
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
