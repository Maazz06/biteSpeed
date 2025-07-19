const { connectDatabase } = require('./database.js');
const app = require('./index.js');
const port = 3000;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, '0.0.0.0', () => {
      console.log(`App is running on Port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
  }
}

startServer();