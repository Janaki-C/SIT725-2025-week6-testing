const { ObjectId } = require('mongodb');
const { getDb } = require('../dbconnection');

class ContentModel {
    static async get() {
        try {
            const db = getDb();
            return await db.collection('contents').find().toArray();
        } catch (error) {
            throw error;
        }
    }

    static async add(content) {
        try {
            const db = getDb();
            const result = await db.collection('contents').insertOne({
                ...content,
                createdAt: new Date()
            });
            return { ...content, _id: result.insertedId };
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        try {
            // Validate ObjectId format
            if (!ObjectId.isValid(id)) {
                return { success: false, error: 'Invalid ID format' };
            }

            const db = getDb();
            const result = await db.collection('contents')
                .deleteOne({ _id: new ObjectId(id) });

            return {
                success: result.deletedCount > 0,
                error: result.deletedCount === 0 ? 'Content not found' : null
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = ContentModel;