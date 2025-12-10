import app from './app';
import { ENV } from './config/env';
import { redis } from './config/redis';

async function startServer() {
  try {

    if (typeof (redis as any).connect === 'function') {
      await (redis as any).connect();
      console.log(' Local Redis connected');
    } else {
      console.log('Using Upstash Redis (no manual connect needed)');
    }
    app.listen(ENV.PORT, () => {
      console.log(` Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
