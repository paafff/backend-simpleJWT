const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Authrouter = require('./routes/Auth');
const userRouter = require('./routes/User');

const app = express();
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(Authrouter);
app.use(userRouter);

app.get('/', (req, res) => {
  res.send('ini hasil app.get / ');
});

app.listen(SERVER_PORT, () => {
  console.log('server jalan bang' + SERVER_PORT);
});
