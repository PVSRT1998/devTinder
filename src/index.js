const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

const port = 3001;

app.use(express.json()); // Middleware to parse JSON request bodies


app.patch('/user', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.body.userId, req.body);
        res.send("User updated successfully!");
    } catch (err) {
        console.error('Error updating user', err);
        res.status(500).send("Error updating user");
    }
});

app.delete('/user', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.body.userId);
        res.send("User deleted successfully"); 
    } catch (err) {
        console.error('Error deleting user', err);
        res.status(500).send("Error deleting user");
    }
});

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        console.error('Error fetching users', err);
        res.status(500).send("Error fetching users");
    }
});

app.get('/user', async (req, res) => {
    try {
        const users = await User.findOne({ emailId: req.body.emailId });
        if (!users) {
            return res.status(404).send("User not found");
        }
        res.send(users);
    } catch (err) {
        console.error('Error fetching user details', err);
        res.status(500).send("Error fetching user details");
    }
});

app.post('/signup', async (req, res) => {
    console.log('Received signup request:', req.body);
    const user = new User(req.body);

    try {
        await user.save();
        console.log('User details saved successfully');
        res.send("User details saved successfully");
    } catch (err) {
        console.error('Error saving user details', err);
        res.status(400).send("Error saving user details", err);
    }

});

connectDB()
    .then(() => {
        console.log('Connected to the database');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to the database', err);
    });
