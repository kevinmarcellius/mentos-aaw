import pino from "pino";

// Asynchronous logging
const fs = require('fs');
if (!fs.existsSync('../logs')) {
  fs.mkdirSync('../logs');
}
const logger = pino({
  formatters: {
    level: (label) => {
      return {
        level: label
      }
    }
  },
  transport: {
    target: 'pino/file',
    options: { destination: '../logs/app.log' }
  }
});

export default logger;