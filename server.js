const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connectToDatabase } = require('./dbconnection');
const router = require('./router/router');

const app = express();

// ✅ Parse incoming JSON and form data before routing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Serve static files
app.use(express.static(path.join(__dirname)));

// ✅ Add request timeout
app.use((req, res, next) => {
    req.setTimeout(5000, () => {
        res.status(408).json({ error: 'Request timeout' });
    });
    next();
});

// ✅ API Routes (Only once!)
app.use('/api', router);

// ✅ Root route (landing page)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ✅ Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something broke!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ✅ 404 Not Found fallback
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// ✅ Start server with DB connection
async function startServer() {
    try {
        await connectToDatabase();
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// ✅ Export for Mocha tests
module.exports = app;
