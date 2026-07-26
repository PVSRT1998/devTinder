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

module.exports = { adminAuth };