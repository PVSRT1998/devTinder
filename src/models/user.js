const mongoose = require('mongoose');
const { Schema } = mongoose;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = "Dev@TinderSecretKey"; // Replace with your own secret key

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 50,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: String,
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        lowercase: true,
        validate(value) {
            if(!['male', 'female', 'other'].includes(value)) {
                throw new Error('Gender must be either male, female, or other');
            }
        }
    },
    about: {
        type: String,
        maxlength: 500,
        default: "This user prefers to keep an air of mystery about them."
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true
});

userSchema.methods.validatePassword = function(password) {
    const user = this;
    return bcrypt.compare(password, user.password);
}

userSchema.methods.EncryptPassword = async function(password) {
    const user = this;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

userSchema.methods.getJWT = function() {
    const user = this;
    const payload = { userId: user._id };
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
}

const User = mongoose.model("User", userSchema);

module.exports = User;