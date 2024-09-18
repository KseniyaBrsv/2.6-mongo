const express = require('express')
const { v4: uuid } = require('uuid')
const axios = require('axios');
const counterUrl = process.env.COUNTER_URL || 'http://counter:3001';
const router = express.Router()
const Book = require('../models/books');

// Получить все книги
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.render('book/index', {
      title: 'Просмотр списка книг',
      books: books
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
});

// Создать книгу
router.get('/create', (req, res) => {
  res.render('book/create', {
    title: 'Добавить книгу',
    book: {}
  });
});

router.post('/create', async (req, res) => {
  const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body;

  try {
    const newBook = new Book({
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook
    });

    await newBook.save();
    res.redirect('/api/books');
  } catch (err) {
    console.error(err);
    res.status(400).send('Ошибка при создании книги');
  }
});

// Получить книгу по ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Увеличить счётчик
    await axios.post(`${counterUrl}/counter/${id}/incr`);

    // Получить значение счётчика
    const { data: { count } } = await axios.get(`${counterUrl}/counter/${id}`);

    const book = await Book.findById(id);

    if (book) {
      res.render('book/view', {
        title: `Информация по книге ${book.title}`,
        book: book,
        count: count
      });
    } else {
      res.render('error/404', { title: 'Книга не найдена' });
    }
  } catch (error) {
    console.error('Ошибка при получении книги или счётчика:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Редактировать книгу по ID
router.get('/update/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);

    if (book) {
      res.render('book/update', {
        title: 'Редактирование',
        book: book
      });
    } else {
      res.render('error/404', { title: 'Что-то пошло не так' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
});

router.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(id, {
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook
    }, { new: true });

    if (updatedBook) {
      res.redirect('/api/books');
    } else {
      res.render('error/404', { title: 'Что-то пошло не так' });
    }
  } catch (err) {
    console.error(err);
    res.status(400).send('Ошибка при обновлении книги');
  }
});

// Удалить книгу по ID
router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Book.findByIdAndDelete(id);

    if (result) {
      res.redirect('/api/books');
    } else {
      res.render('error/404', { title: 'Что-то пошло не так' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка сервера');
  }
});

module.exports = router
