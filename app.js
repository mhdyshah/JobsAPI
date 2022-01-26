require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const jobsRouter = require('./routes/jobs');
// authentication user system
const authenticationUser = require('./middleware/authentication');


// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const morgan = require('morgan');


//connectDB
const connectDB = (url) => {
    return mongoose.connect(url);
}


// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');



app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(morgan("dev"));

// routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticationUser, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();