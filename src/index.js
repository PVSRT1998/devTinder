const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const { userAuth } = require('./middlewares/auth');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
const cors = require('cors');

const port = 3001;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
})); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies


app.use('/', authRouter); // Use the authRouter for authentication routes
app.use('/', profileRouter); // Use the profileRouter for profile routes
app.use('/', requestRouter); // Use the requestRouter for request routes
app.use('/', userRouter); // Use the userRouter for user routes

connectDB()
    .then(() => {
        console.log('Connected to the database');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to the database', err);
    });
