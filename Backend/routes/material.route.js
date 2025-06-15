import express from "express"
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";
import User from "../models/user.model.js";
import Material from "../models/material.model.js";

const router = express.Router()

// GET /all-materials/:userId - Get all materials for a user
router.get('/all-materials/:userId', ensureAuthenticated, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select('materials');
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Populate the materials array with fileId, fileName, createdAt, and _id (material id)
    const materials = await Material.find({ _id: { $in: user.materials } })
      .select('fileId fileName createdAt')
      .lean();
    // No need to remap, just send as-is (frontend can use _id)
    res.json({ materials });
  } catch (err) {
    console.error('Error in GET /all-materials/:userId:', err);
    res.status(500).json({ message: 'Failed to fetch materials', error: err.message });
  }
});

// POST /upload-material - Upload a new material and add to user's materials
router.post('/upload-material', ensureAuthenticated, async (req, res) => {
  try {
    const { fileId, fileName } = req.body;
    if (!fileId || !fileName) {
      return res.status(400).json({ message: 'fileId and fileName are required' });
    }
    // Create new material
    const material = await Material.create({ fileId, fileName });
    // Push material id to user's materials array
    await User.findByIdAndUpdate(req.user._id, { $push: { materials: material._id } });
    res.status(201).json({ message: 'Material uploaded', material });
  } catch (err) {
    console.error('Error in POST /upload-material:', err);
    res.status(500).json({ message: 'Failed to upload material', error: err.message });
  }
});

// DELETE /delete-material/:materialId - Delete a material and remove from user's materials
router.delete('/delete-material/:materialId', ensureAuthenticated, async (req, res) => {
  try {
    const { materialId } = req.params;
    // Remove material from user's materials array
    await User.findByIdAndUpdate(req.user._id, { $pull: { materials: materialId } });
    // Delete the material document
    await Material.findByIdAndDelete(materialId);
    res.json({ message: 'Material deleted', materialId });
  } catch (err) {
    console.error('Error in DELETE /delete-material/:materialId:', err);
    res.status(500).json({ message: 'Failed to delete material', error: err.message });
  }
});



export default router;