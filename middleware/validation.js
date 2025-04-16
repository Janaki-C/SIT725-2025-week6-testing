const validateContent = (req, res, next) => {
    const { heading, description, picture } = req.body;

    if (!heading || !description || !picture) {
        return res.status(400).json({
            error: 'All fields are required (heading, description, picture)',
        });
    }

    next();
};

module.exports = {
    validateContent
};
