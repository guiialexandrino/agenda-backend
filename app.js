require('dotenv').config();
const express = require('express');
const app = express();
const apiEnter = require('./routes/enter.js');
const apiUser = require('./routes/api-user.js');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(
  process.env.MONGO_CONNECTION_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (error) => {
    if (error) console.log(error);
    else console.log('Banco carregado...');
  },
);

app.use(cors({ exposedHeaders: ['authorization-token'] }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/enter', apiEnter);
app.use('/api', apiUser);

app.listen(process.env.PORT, () => {
  console.log('Servidor rodando...');
});
