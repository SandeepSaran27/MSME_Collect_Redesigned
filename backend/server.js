const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const initInvoiceMonitorJob = require('./jobs/invoiceMonitor');

let PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  // Initialize background cron jobs
  initInvoiceMonitorJob();

  // Start HTTP server with port fallback handling
  const startServer = (portToTry) => {
    const server = app.listen(portToTry, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${portToTry}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${portToTry} is in use, retrying on port ${portToTry + 1}...`);
        startServer(portToTry + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  };

  startServer(Number(PORT));
});
