const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const USER_SELECT_FIELDS = 'firstName lastName emailId age gender skills about';

userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user; // Access the authenticated user from the request
        const receivedRequests = await ConnectionRequest.find({ toUserId: loggedInUser._id, status: "interested" }).populate('fromUserId', USER_SELECT_FIELDS);
        res.json({
            message: `Received connection requests for ${loggedInUser.firstName} ${loggedInUser.lastName}`,
            data: receivedRequests
        })
    } catch (err) {
        console.error('Error fetching received connection requests', err);
        res.status(500).send("ERROR : " + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.user; // Access the authenticated user from the request

        const acceptedRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate('fromUserId', USER_SELECT_FIELDS).populate('toUserId', USER_SELECT_FIELDS);

        const data = acceptedRequests.map(request =>  {
            if(request.fromUserId._id.equals(loggedInUser._id)) {
                return request.toUserId;
            }
            return request.fromUserId;
        });
        res.json({
            message: `Connections for ${loggedInUser.firstName} ${loggedInUser.lastName}`,
            data
        });

    } catch (err) {
        console.error('Error fetching connections', err);
        res.status(500).send("ERROR : " + err.message);
    }
});

userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user; // Access the authenticated user from the request

        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        let limit = parseInt(req.query.limit) || 10;
        limit =  limit > 50 ? 50 : limit; // Limit the maximum number of users per page to 50
        // Calculate the skip value for pagination
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select('fromUserId toUserId');

        const hideConnectionUserIds = new Set();
        connectionRequests.forEach(request => {
            hideConnectionUserIds.add(request.fromUserId.toString());
            hideConnectionUserIds.add(request.toUserId.toString());
        });

        const otherUsers = await User.find({ _id: { $ne: loggedInUser._id, $nin: Array.from(hideConnectionUserIds) } }).select(USER_SELECT_FIELDS).skip(skip).limit(limit);
        res.json({
            message: `User feed for ${loggedInUser.firstName} ${loggedInUser.lastName}`,
            data: otherUsers
        });
    } catch (err) {
        console.error('Error fetching user feed', err);
        res.status(500).send("ERROR : " + err.message);
    }
});
module.exports = userRouter;