import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth-routes.js'; 
import ticketRouter from './routes/ticket-routes.js';
import dotenv from 'dotenv'
dotenv.config()
mongoose.connect(process.env.MONGO_URL)
.then(()=>{console.log('Connected to MongoDB')}).catch((err)=>{console.log(err)});
const app = express();
const PORT = process.env.PORT || 5000;
app.use(
    cors({
        origin: '*',
        methods :  ['GET', 'POST','DELETE','PUT'],
        allowedHeaders:[
            "content-type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials : true

    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var data={};

app.post('/checkingstatus', (req, res) => {
    console.log(req.body);
    data = req.body; 
    const {MovieName,status} = req.body;
    console.log('MovieName'+ " " +MovieName);
    
    console.log('data'+ " " +data); 
    res.send('Server is working');
});

app.get('/checkingstatus', (req, res) => {

    res.send(data); 
});
app.get('/',(req,res)=>{
    console.log('hello');
    
})

app.use('/api/auth',authRouter);
app.use('/api/tickets', ticketRouter);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);

  });;