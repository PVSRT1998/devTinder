const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['ignored', "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status, please choose from 'ignored', 'interested', 'accepted', or 'rejected'`,
        }
    }
}, {
    timestamps : true, // Automatically add createdAt and updatedAt fields
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); // Create a compound index to ensure uniqueness of connection requests between two users

connectionRequestSchema.pre('save', async function(next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send a connection request to yourself");
    }
});

const ConnectionRequest = new mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest;