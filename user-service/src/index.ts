import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/config';
import uploadRoute from './routes/upload.routes';

const app = express();
const PORT = config.port;

app.use(cors({
  allowedHeaders: ["*"],
  origin: "*"
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

app.use('/upload', uploadRoute);

app.get('/', (req: Request, res: Response) => {
  res.json('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});