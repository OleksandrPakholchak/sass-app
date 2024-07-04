const {
  Campaign,
  validateUser,
  validateCampaign,
} = require("../models/Campaign");

const { scheduleCampaign } = require("../utils/scheduleCall");

const createCampaign = async (req, res) => {
  try {
    // const campaignError = validateCampaign(req.body);
    // if (campaignError.error)
    //   return res.status(400).send(campaignError.error.details[0].message);
    // const userError = validateUser(req.body.users);
    // if (userError.error)
    //   return res.status(400).send(userError.error.details[0].message);

    const author = req.user._id;
    const campaign = await Campaign.create({
      ...req.body,
      author,
    });
    const config = {
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      userList: campaign.users,
      type: campaign.campaignType,
    };
    scheduleCampaign(config);
    res.status(201).json({ campaign });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    return res.status(200).json({ campaigns });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    let campaign = await Campaign.findById(id).populate("author").exec();
    if (!campaign)
      return res.status(404).json({ message: "Cannot find campaign" });
    return res.status(200).json({ campaign });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, campaignType, role, users } = req.body;

    const campaign = await Campaign.findById(id);
    if (!campaign)
      return res.status(400).json({ message: "Cannot find campaign" });
    campaign.startDate = startDate;
    campaign.endDate = endDate;
    campaign.campaignType = campaignType;
    campaign.role = role;
    campaign.users = users;
    await campaign.save();

    res.status(200).json({ campaign });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByIdAndDelete(id);
    if (campaign == null) {
      return res.status(404).json({ message: "Cannot find campaign" });
    }

    res.status(200).json({ campaign });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
};
