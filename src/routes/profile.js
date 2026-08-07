const express = require('express');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user; // Access the authenticated user from the request

        res.send(user);
    } catch (err) {
        console.error('Error fetching user profile', err);
        res.status(500).send("Error fetching user profile");
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        const user = req.user; // Access the authenticated user from the request
        const AllowedUpdates = ['firstName', 'lastName', 'emailId', 'age', 'gender', 'skills', 'about'];
        const updates = Object.keys(req.body);
        const isValidOperation = updates.every((update) => AllowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send("Invalid updates");
        }

        // Update the user document
        updates.forEach((update) => {
            user[update] = req.body[update];
        });

        await user.save();
        res.send("Profile updated successfully");
    } catch (err) {
        console.error('Error editing user profile', err);
        res.status(500).send("Error editing user profile");
    }
});

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const user = req.user; // Access the authenticated user from the request
        const { password } = req.body;
        const isOldPasswordMatch = await user.validatePassword(password);
        if(isOldPasswordMatch) {
            res.send("Password is same as old password, please choose a new password");
        }
        // Encrypt the new password before saving (you can use bcrypt or any other library)
        const newPasswordHash = await user.EncryptPassword(password);
        user.password = newPasswordHash;
        await user.save();
        res.send("Password updated successfully");
    } catch (err) {
        console.error('Error during forgot password process', err);
        res.status(500).send("Error during forgot password process");
    }
});

module.exports = profileRouter;