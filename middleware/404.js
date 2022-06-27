const notFound = (req, res, next) => {
    res.status(404).json({ msg: 'Route doesnot exist' });
}

module.exports = notFound;