const cron = require("node-cron");
const { DateTime } = require("luxon");

const {
  makeOutBoundCall,
  makeOutBoundEmail,
  makeOutboundWhatsApp,
} = require("./outBound");

const businessStartHour = 9;
const businessEndHour = 17;

// Check if date is within business hours
const isBusinessHours = (date) => {
  const hour = date.hour;
  return (
    hour >= businessStartHour && hour < businessEndHour && date.weekday <= 5
  );
};

// Get the next business day if the current date is outside business hours
const getNextBusinessDay = (date) => {
  let nextDate = date
    .plus({ days: 1 })
    .startOf("day")
    .set({ hour: businessStartHour });
  while (nextDate.weekday > 5) {
    // Skip weekends
    nextDate = nextDate.plus({ days: 1 });
  }
  return nextDate;
};

// Get the next call time within business hours
const getNextCallTime = (currentTime, interval) => {
  let nextTime = currentTime.plus({ milliseconds: interval });
  if (!isBusinessHours(nextTime)) {
    if (nextTime.hour >= businessEndHour) {
      nextTime = getNextBusinessDay(nextTime);
    } else if (nextTime.hour < businessStartHour) {
      nextTime = nextTime.set({
        hour: businessStartHour,
        minute: 0,
        second: 0,
      });
    }
  }
  return nextTime;
};

// Calculate total business intervals between start and end dates
const calculateBusinessIntervals = (startDate, endDate, userList) => {
  let currentTime = startDate;
  let totalBusinessMinutes = 0;

  while (currentTime < endDate) {
    if (isBusinessHours(currentTime)) {
      totalBusinessMinutes += 1;
    }
    currentTime = currentTime.plus({ minutes: 1 });
  }

  const intervalMinutes = totalBusinessMinutes / userList.length;
  return intervalMinutes * 60 * 1000; // Convert to milliseconds
};

// Schedule calls using cron jobs
const scheduleCalls = (startDate, interval, { userList, type }) => {
  let currentTime = startDate;

  userList.forEach((user) => {
    const callTime = getNextCallTime(currentTime, interval);
    currentTime = callTime;

    const cronTime = `${callTime.second} ${callTime.minute} ${callTime.hour} ${callTime.day} ${callTime.month} *`;

    cron.schedule(cronTime, async () => {
      if (config.voice) {
        console.log(`Calling ${user} at ${callTime.toISO()}`);
        makeOutBoundCall(user.phoneNumber);
      }
      if (config.whatsapp) {
        console.log(`Calling by WhatsApp ${user} at ${callTime.toISO()}`);
        makeOutboundWhatsApp(user.phoneNumber);
      }
      if (config.email) {
        console.log(`Calling by Email ${user} at ${callTime.toISO()}`);
        makeOutBoundEmail(user.email);
      }
      // Implement the actual call logic here
    });

    console.log(`Scheduled call for ${user} by ${type} at ${callTime.toISO()}`);
  });
};

// Main function to execute the scheduling
const scheduleCampaign = (config) => {
  // Initialize Dates
  const startDate = DateTime.fromISO(config.startDate.toISOString(), {
    zone: "utc",
  }).plus({
    hours: businessStartHour,
  });
  const endDate = DateTime.fromISO(config.endDate.toISOString(), {
    zone: "utc",
  }).plus({
    hours: businessEndHour,
  });

  const interval = calculateBusinessIntervals(
    startDate,
    endDate,
    config.userList
  );
  scheduleCalls(startDate, interval, config);
};

module.exports = { scheduleCampaign };
