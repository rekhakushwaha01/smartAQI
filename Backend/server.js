const config = require('./src/config/env');
const app = require('./src/app');
const connectDB = require('./src/db/db');

async function start() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`server is running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();
