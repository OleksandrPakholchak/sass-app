const express = require("express");
const router = express.Router();

const {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/campaignController");

// CAMPAIGN
router.post("/", createCampaign);
router.get("/", getCampaigns);
router.get("/:id", getCampaign);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

module.exports = router;
