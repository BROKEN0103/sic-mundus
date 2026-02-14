const Model3D = require("../models/Model3D");
const Activity = require("../models/Activity");

exports.uploadModel = async (req, res) => {
  console.log(`[Backend] Upload attempt: ${req.body.title}`);
  console.log(`[Backend] User:`, req.user);
  console.log(`[Backend] File:`, req.file);

  try {
    if (!req.file) {
      console.warn(`[Backend] Upload failed: No file in request`);
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!req.user || !req.user.userId) {
      console.warn(`[Backend] Upload failed: No user ID in token`);
      return res.status(401).json({ message: "Invalid user session" });
    }

    const model = await Model3D.create({
      title: req.body.title,
      description: req.body.description,
      fileUrl: req.file.filename,
      uploadedBy: req.user.userId
    });

    await Activity.create({
      user: req.user.userId,
      action: "upload",
      document: model._id,
      details: `Uploaded model: ${model.title}`
    });

    res.json(model);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getModels = async (req, res) => {
  const models = await Model3D.find().populate("uploadedBy", "name");
  res.json(models);
};

exports.getSingleModel = async (req, res) => {
  const model = await Model3D.findById(req.params.id);
  res.json(model);
};
