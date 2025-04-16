const express = require('express');
const router = express.Router();
const ContentController = require('../controller/controller');
const { validateContent } = require('../middleware/validation');

router.get('/getContent', ContentController.getAllContent);
router.post('/addContent', validateContent, ContentController.addContent); // ✅ validation middleware
router.delete('/deleteContent/:id', ContentController.deleteContent);

module.exports = router;
