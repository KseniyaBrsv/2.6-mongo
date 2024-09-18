const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('./middleware/logger');
const error404 = require('./middleware/err-404');
const userRouter = require('./routes/user');
const booksRouter = require('./routes/books');
require('dotenv').config(); // Загрузка переменных окружения из .env файла

const app = express();
const MONGO_URI = process.env.MONGO_URI; // Строка подключения к MongoDB из переменных окружения
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(logger);

// Авторизация пользователя
app.use('/', userRouter);
// Книги
app.use('/api/books', booksRouter);

app.use(error404);

async function start() {
  try {
    // Подключение к MongoDB с использованием Mongoose
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
    
    // Запуск сервера Express
    app.listen(PORT, () => {
      console.log(`Book viewer listening at http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error('Error connecting to MongoDB:', e);
  }
}

start();

