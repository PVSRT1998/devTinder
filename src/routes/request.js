const express = require('express');
const requestRouter = express.Router();

requestRouter.post('/sendConnectionRequest', async (req, res) => {
    const user = req.user; // Access the authenticated user from the request

    console.log("Sending connection request from user:", user._id);

    res.send(user.firstName + " " + user.lastName + " sent a connection request");
});

module.exports = requestRouter;