const twilio = require("twilio");
const {
  Conversation,
  validateConversation,
} = require("../models/Conversation");

const createConversation = async (req, res) => {
  const { error } = validateConversation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const conversation = await Conversation.create({
      ...req.body,
    });
    return res.status(201).json({ conversation });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getConversations = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const conversations = await Conversation.find({
      createdAt: {
        $gte: startDate,
        $lte: new Date(endDate).setDate(new Date(endDate).getDate() + 1),
      },
    });

    const client = new twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const recordings = await client.recordings.list({
      dateCreatedAfter: startDate,
      dateCreatedBefore: new Date(endDate).setDate(
        new Date(endDate).getDate() + 1
      ),
    });

    // Fetch call details for each recording concurrently
    const fetchCallDetails = async (recording) => {
      const call = await client.calls(recording.callSid).fetch();
      return {
        recordingSid: recording.sid,
        from: call.from,
        to: call.to,
        recordingUrl: `https://api.twilio.com${recording.uri.replace(
          ".json",
          ".wav"
        )}`,
      };
    };

    // Process all recordings concurrently with a concurrency limit
    const concurrencyLimit = 10;
    const chunks = [];
    for (let i = 0; i < recordings.length; i += concurrencyLimit) {
      const chunk = recordings.slice(i, i + concurrencyLimit);
      chunks.push(chunk);
    }

    const results = [];
    for (const chunk of chunks) {
      const chunkResults = await Promise.all(chunk.map(fetchCallDetails));
      results.push(...chunkResults);
    }

    return res.status(200).json({ conversations, recordings: results });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createConversation,
  getConversations,
};
