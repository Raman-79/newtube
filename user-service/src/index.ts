import express,{Request,Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import uploadRoute from './routes/upload.routes'
dotenv.config();

const app = express();  
const PORT = process.env.PORT || 8080;  

app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
}
));  

app.use(express.json({ limit: '100mb' }));

app.use(express.urlencoded({ extended: true,limit:'100mb' }));
app.use('/upload', uploadRoute);    
// app.use('/publish', kafkaRoutes);
app.get('/' , (req:Request, res:Response) => {
    res.json('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});