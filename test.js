const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getDB } = require('./db');

// ১. CREATE: নতুন ব্লগ তৈরি (POST /blog)
router.post('/blog', async (req, res) => {
  try {
    const db = getDB();
    const blogCollection = db.collection('blogs');

    const newBlog = {
      title: req.body.title,
      content: req.body.content,
      createdAt: new Date(),
    };

    const result = await blogCollection.insertOne(newBlog);
    res.status(201).json({
      message: 'Blog created successfully',
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ২. READ ALL: সব ব্লগ নিয়ে আসা (GET /blog)
router.get('/blog', async (req, res) => {
  try {
    const db = getDB();
    const blogCollection = db.collection('blogs');

    const blogs = await blogCollection.find({}).toArray();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ৩. READ SINGLE: নির্দিষ্ট একটি ব্লগ দেখা (GET /blog/:id)
router.get('/blog/:id', async (req, res) => {
  try {
    const db = getDB();
    const blogCollection = db.collection('blogs');

    const blog = await blogCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Invalid ID format or server error' });
  }
});

// ৪. UPDATE: একটি ব্লগ আপডেট করা (PUT /blog/:id)
router.put('/blog/:id', async (req, res) => {
  try {
    const db = getDB();
    const blogCollection = db.collection('blogs');

    const updatedBlog = {
      title: req.body.title,
      content: req.body.content,
      updatedAt: new Date(),
    };

    const result = await blogCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedBlog }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ৫. DELETE: একটি ব্লগ ডিলিট করা (DELETE /blog/:id)
router.delete('/blog/:id', async (req, res) => {
  try {
    const db = getDB();
    const blogCollection = db.collection('blogs');

    const result = await blogCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;