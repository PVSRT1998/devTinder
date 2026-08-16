const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secretKey = "Dev@TinderSecretKey"; // Replace with your own secret key
const adminAuth = (req, res, next) => {
    console.log('Admin authentication middleware');
    const token = 'xyz';
    const isAdminAuthorized = token === 'xyz';
    if (isAdminAuthorized) {
        next();
    } else {
        res.status(401).send('Unauthorized access');
    }
};

const userAuth = async (req, res, next) => {
    try {
        //Read the token from the request headers or cookies
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).send({message: "Unauthorized, please login"})
        }

        // Validate the token and check if the user is authorized
        const decodedObj = await jwt.verify(token, secretKey);
        const { userId } = decodedObj;

        // Find the user
        const user = await User.findById({ _id: userId });
        if (!user) {
            throw new Error('Unauthorized: User not found');
        }
        req.user = user; // Attach the user object to the request for further use
        next();
    } catch (err) {
        console.error('Error in userAuth middleware', err);
        res.status(401).send('Unauthorized: Invalid token');
    }
}

module.exports = { adminAuth, userAuth };