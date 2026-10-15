const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { getDB } = require("./db");

// Joi Validation Schemas
const blogCreateSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).required().messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title should be at least 3 characters long",
    "string.max": "Title cannot exceed 150 characters",
    "any.required": "Title is required",
  }),
  content: Joi.string().trim().min(5).required().messages({
    "string.empty": "Content cannot be empty",
    "string.min": "Content should be at least 5 characters long",
    "any.required": "Content is required",
  }),
});

const blogUpdateSchema = Joi.object({
  title: Joi.string().trim().min(3).max(150).messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title should be at least 3 characters long",
    "string.max": "Title cannot exceed 150 characters",
  }),
  content: Joi.string().trim().min(5).messages({
    "string.empty": "Content cannot be empty",
    "string.min": "Content should be at least 5 characters long",
  }),
})
  .min(1)
  .messages({
    "object.min":
      "At least one field (title or content) must be provided for update",
  });

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) =>
  ObjectId.isValid(id) && String(new ObjectId(id)) === id;

// 1. CREATE
router.post("/blog", async (req, res) => {
  try {
    // Joi Validation
    const { error, value } = blogCreateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const db = getDB();
    const blogCollection = db.collection("blogs");

    const newBlog = {
      title: value.title,
      content: value.content,
      createdAt: new Date(),
    };

    const result = await blogCollection.insertOne(newBlog);
    res.status(201).json({
      message: "Blog created successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. READ ALL
router.get("/blog", async (req, res) => {
  try {
    const db = getDB();
    const blogCollection = db.collection("blogs");

    const blogs = await blogCollection.find({}).toArray();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. READ SINGLE
router.get("/blog/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid MongoDB ID format" });
    }

    const db = getDB();
    const blogCollection = db.collection("blogs");

    const blog = await blogCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. UPDATE
router.put("/blog/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid MongoDB ID format" });
    }

    // Joi Validation
    const { error, value } = blogUpdateSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((detail) => detail.message),
      });
    }

    const db = getDB();
    const blogCollection = db.collection("blogs");

    const updatedBlog = {
      ...value,
      updatedAt: new Date(),
    };

    const result = await blogCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedBlog },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. DELETE
router.delete("/blog/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid MongoDB ID format" });
    }

    const db = getDB();
    const blogCollection = db.collection("blogs");

    const result = await blogCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
