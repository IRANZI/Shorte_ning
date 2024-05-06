// app.js
const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');

const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/urlShortener', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const ShortUrl = mongoose.model('ShortUrl', {
  full: { type: String, required: true },
  short: { type: String, required: true, default: shortid.generate }
});

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(3000, () => console.log('Server is running on port 3000'));
