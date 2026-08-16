const express = require('express');
const { userAuth } = require('../middlewares/auth');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');

requestRouter.post('/request/send/:status/:userId', userAuth, async (req, res) => {
    try {
        const user = req.user; // Access the authenticated user from the request
        const fromUserId = user._id;
        const toUserId = req.params.userId;
        const status = req.params.status;
        const allowedStatus = ['ignored', 'interested'];
        if(!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status, please choose from 'ignored' or 'interested'");
        }

        const isToUserExists = await User.findById({ _id: toUserId });
        if(!isToUserExists) {
            return res.status(400).send("Invalid userId, user does not exist");
        }

        const isExistingConnectionRequest = await ConnectionRequest.findOne({ 
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
         });
        if(isExistingConnectionRequest) {
            return res.status(400).send("Connection request already sent to this user");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({ message: `${user.firstName} ${user.lastName} sent a connection request to ${isToUserExists.firstName} ${isToUserExists.lastName}`, data });
    } catch (err) {
        console.error('Error sending connection request', err);
        res.status(500).send("ERROR : " + err.message);
    }
    
    
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user; // Access the authenticated user from the request
        const requestId = req.params.requestId;
        const status = req.params.status;
        const allowedStatus = ['accepted', 'rejected'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Invalid status, please choose from 'accepted' or 'rejected'");
        }
        console.log(requestId)
        const connectionRequest = await ConnectionRequest.findOne({ 
            _id: requestId,
            toUserId: loggedInUser._id, // Ensure that the logged-in user is the recipient of the connection request
            status: 'interested' 
        });
        if (!connectionRequest) {
            return res.status(404).send("Invalid requestId, connection request does not exist");
        }

        connectionRequest.status = status;
        const data  = await connectionRequest.save();
        res.json({ message: `Connection request ${status} successfully`, data });

    } catch (err) {
        console.error('Error reviewing connection request', err);
        res.status(500).send("ERROR : " + err.message);
    }
});

module.exports = requestRouter;