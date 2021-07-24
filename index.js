const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// connect to db
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.log('DB CONNECTION ERROR: ', err));

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const questionRoutes = require('./routes/questions');
const answerRoutes = require('./routes/answer');

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors()); // allows all origins
if ((process.env.NODE_ENV == 'development')) {
    app.use(cors({ origin: `http://localhost:3000` }));
}
if ((process.env.NODE_ENV == 'production')) {
    app.use(cors({ origin: `https://g-connect.vercel.app` }));
}

// middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', questionRoutes);
app.use('/api', answerRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`API is running on port ${port}`);
});

app.get('/', (req, res) =>
    res.json({ message: 'QA-Flow API are ready to serve 🚀' })
);
