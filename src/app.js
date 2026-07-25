const express = require('express');

const app = express();

const port = 3000;

// app.use((req, res) => {
//   res.send('Hello, from the server!');
// });

// app.use('/', (req, res) => {
//   res.send('Hello, from the dashboard!');
// });

// app.use('/test', (req, res) => {
//   res.send('Hello, from the server!');
// });

/* This will only handle GET call to /user**/   
app.get('/user', (req, res) => {
  res.send({firstName: 'John', lastName: 'Doe'});
});

app.post('/user', (req, res) => {
    console.log(req.body);
  res.send("Data received successfully");
});

app.delete('/user', (req, res) => {
  res.send('Deleted user successfully');
});

app.patch('/user', (req, res) => {
  res.send('Updated user successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});