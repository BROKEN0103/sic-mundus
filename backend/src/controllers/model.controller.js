const Model3D = require("../models/Model3D");
const Activity = require("../models/Activity");

exports.uploadModel = async (req, res) => {
  const model = await Model3D.create({
    title: req.body.title,
    description: req.body.description,
    fileUrl: req.file.path,
    uploadedBy: req.user.id
  });

  await Activity.create({
    user: req.user.id,
    action: "Uploaded model"
  });

  res.json(model);
};

exports.getModels = async (req, res) => {
  const models = await Model3D.find().populate("uploadedBy", "name");
  res.json(models);
};

exports.getSingleModel = async (req, res) => {
  const model = await Model3D.findById(req.params.id);
  res.json(model);
};
