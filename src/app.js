const express = require('express');

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});