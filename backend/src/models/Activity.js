const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  document: { type: mongoose.Schema.Types.ObjectId, ref: "Model3D" },
  action: String,
  details: String,
  granted: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);
