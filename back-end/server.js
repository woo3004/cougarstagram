const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({
    dest: '../front-end/public/images',
    limits: {
        fileSize: 10000000
    }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/cougarstagram', {
    useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Upload photo
app.post('/api/photos', upload.single('photo'), async (req, res) => {
    if (!req.file) {
      return res.sendStatus(400);
    }
    res.send({
      path: "/images/" + req.file.filename
    });
});

const users = require("./users.js");
app.use("/api/users", users.routes);

const posts = require("./posts.js");
app.use("/api/posts", posts.routes);

app.listen(3002, () => console.log('Server listening on port 3002!'));