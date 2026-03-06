import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import { connectDB } from './lib/db.js'
import figlet from 'figlet';
import booksRoutes from './routes/books.routes.js'
import job from './lib/cron.js'

figlet('Server is running!', (err, data) => {
  if (err) {
    console.log('Something went wrong...');
    console.dir(err);
    return;
  }
  console.log(data);
});
const dirname = import.meta.dirname
dotenv.config()

const PORT = process.env.PORT || 3000
const app = express();

job.start()
app.use(express.json())
app.use(cors())

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is alive" });
  console.log("Health check received at /health endpoint");
});

app.use("/api/auth",authRoutes) 
app.use("/api/books",booksRoutes) 



const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
startServer()

