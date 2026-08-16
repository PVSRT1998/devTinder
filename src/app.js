const express = require('express');
const { adminAuth } = require('./middlewares/auth');

const app = express();

const port = 3000;

// app.use((req, res) => {
//   res.send('Hello, from the server!');
// });

app.use('/', (req, res) => {
  res.send('Hello, from the dashboard!');
});

app.use('/test', (req, res) => {
  res.send('Hello, from the server!');
});



app.use('/admin', adminAuth);

app.get('/admin/getAllData', (req, res) => {
    res.send('Welcome to the admin dashboard!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});