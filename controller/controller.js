const ContentModel = require('../models/models');
const { ObjectId } = require('mongodb');
const { getDb } = require('../dbconnection');

const controller = {
    getAllContent: async (req, res) => {
        try {
            const contents = await ContentModel.get();
            res.status(200).json(contents);
        } catch (error) {
            console.error('Error in getAllContent:', error);
            res.status(500).json({ error: 'Error fetching content' });
        }
    },
    addContent: async (req, res) => {
        try {
            const { heading, description, picture } = req.body;
            if (!heading || !description || !picture) {
                return res.status(400).json({
                    error: 'All fields are required (heading, description, picture)',
                });
            }
            
            // Additional validation
            if (
                heading.trim() === '' ||
                description.trim() === '' ||
                picture.trim() === ''
            ) {
                return res.status(400).json({
                    error: 'Fields must not be empty or only whitespace',
                });
            }
            
            if (heading.length > 100 || description.length > 1000) {
                return res.status(400).json({
                    error: 'Heading or description is too long',
                });
            }
            
           
            const content = await ContentModel.add(req.body);
            res.status(201).json({
                message: 'Content added successfully!',
                data: content,
            });
        } catch (error) {
            console.error('Error in addContent:', error);
            res.status(500).json({ error: 'Error adding content' });
        }
    },
    deleteContent: async (req, res) => {
        try {
            const { id } = req.params;

            if (!ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid ID format' });
            }

            const result = await ContentModel.delete(id);

            if (!result.success) {
                if (result.error === 'Content not found') {
                    return res.status(404).json({ error: result.error });
                }
                return res.status(500).json({ error: result.error });
            }

            res.status(200).json({ message: 'Content deleted successfully!' });
        } catch (error) {
            console.error('Error in deleteContent:', error);
            res.status(500).json({ error: 'Error deleting content' });
        }
    },

    
    
    
};

module.exports = controller;
