const validator = require('validator');

const validateSignUpData = (res) => {
    const { firstName, lastName, emailId, password } = res.body;

    if (!firstName || !lastName) {
        throw new Error('First name and last name are required');
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error('First name must be between 4 and 50 characters');
    } else if (lastName.length < 4 || lastName.length > 50) {
        throw new Error('Last name must be between 4 and 50 characters');
    } else if (!emailId) {
        throw new Error('Email ID is required');
    } else if(!validator.isEmail(emailId)) {
        throw new Error('Invalid email format');
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('Password is not strong enough');
    }
}

module.exports = {
    validateSignUpData
};