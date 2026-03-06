import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import { connectDB } from './lib/db.js'
import figlet from 'figlet';
import booksRoutes from './routes/books.routes.js'



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


app.use(express.json())
app.use(cors())

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

