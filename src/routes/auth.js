const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');

authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/login', async (req, res) => {
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

authRouter.post('/logout', (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) }); // Clear the token cookie
    res.send("Logout successful");
});

module.exports = authRouter;