const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const modelController = require("../controllers/model.controller");

router.post("/", auth, upload.single("file"), modelController.uploadModel);
router.get("/", auth, modelController.getModels);
router.get("/:id", auth, modelController.getSingleModel);

module.exports = router;
