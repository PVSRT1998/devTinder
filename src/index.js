const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');

const port = 3001;

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies


app.patch('/user', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.body.userId, req.body, {
            runValidators: true,
        });
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

    try {
        // Validate user data before saving
        validateSignUpData(req);

        const { firstName, lastName, emailId, password, age, gender, skills } = req.body;

        // Encrypt the password before saving (you can use bcrypt or any other library)
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            age,
            gender,
            skills
        });

        await user.save();
        console.log('User details saved successfully');
        res.send("User details saved successfully");
    } catch (err) {
        console.error('Error saving user details', err);
        res.status(400).send("ERROR : " + err.message);
    }

});

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });

        if(!user) {
            return res.status(400).send("Invalid credentials");
        }

        const isPasswordMatch = await user.validatePassword(password);
        if(!isPasswordMatch) {
            return res.status(400).send("Invalid credentials");
        } 

        const token = user.getJWT();
        res.cookie("token", token);

        return res.send("Login successful");
    } catch (err) {
        console.error('Error during login', err);
        res.status(500).send("Error during login");
    }
});

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user; // Access the authenticated user from the request

        res.send(user);
    } catch (err) {
        console.error('Error fetching user profile', err);
        res.status(500).send("Error fetching user profile");
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
