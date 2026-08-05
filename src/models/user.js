const mongoose = require('mongoose');
const { Schema } = mongoose;

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

const User = mongoose.model("User", userSchema);

module.exports = User;