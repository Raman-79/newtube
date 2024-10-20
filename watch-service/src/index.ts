import express,{Request,Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
 import watchRoute from './routes/watch.routes'
dotenv.config();

const app = express();  
const PORT = process.env.PORT || 8081;  

app.use(cors({
    allowedHeaders: ["*"],
    origin: "*"
}
));  

app.use(express.json({  }));

app.use(express.urlencoded({ extended: true }));
app.use('/watch', watchRoute);    
app.get('/' , (req:Request, res:Response) => {
    res.json('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});