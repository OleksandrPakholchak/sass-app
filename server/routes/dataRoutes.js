const express = require("express");
const router = express.Router();

const { upload, uploadAiData } = require("../config/multer");
const {
  uploadFiles,
  getParsedUsersFromFiles,
  uploadFilesToAiData,
} = require("../controllers/dataController");

router.post("/upload", upload.array("files"), uploadFiles);
router.get("/getParsedUsersFromFiles", getParsedUsersFromFiles);
router.post("/uploadAiData", uploadAiData.array("files"), uploadFilesToAiData);

module.exports = router;
