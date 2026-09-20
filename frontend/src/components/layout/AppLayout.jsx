import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AnimatedBackground from '../common/AnimatedBackground';

// Maps each route section to a subtle background color variant.
// Purely decorative — does not affect data fetching or routing.
const routeVariant = (pathname) => {
  // Invoice detail workspace is where document/evidence comparison lives.
  if (/^\/invoices\/[^/]+$/.test(pathname) && !pathname.endsWith('/create')) return 'evidence';
  if (pathname.startsWith('/invoices')) return 'invoices';
  if (pathname.startsWith('/escalations')) return 'escalations';
  if (pathname.startsWith('/customers')) return 'customers';
  return 'dashboard';
};

const AppLayout = () => {
  const location = useLocation();
  const variant = routeVariant(location.pathname);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <AnimatedBackground mode="app" variant={variant} />
        <Navbar />
        <main className="page-body">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
