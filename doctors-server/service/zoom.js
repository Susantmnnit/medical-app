// services/zoom.js
const axios = require("axios");
const jwt = require("jsonwebtoken");

const ZOOM_API_KEY = process.env.ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.ZOOM_API_SECRET;

function generateZoomAccessToken() {
  const payload = {
    iss: ZOOM_API_KEY,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };
  return jwt.sign(payload, ZOOM_API_SECRET);
}

async function generateZoomMeeting(date, startTime) {
  console.log("Received date and startTime:", date, startTime);
  try {
    const token = generateZoomAccessToken();
    console.log("Generated token:", token);

    const dateString = new Date(date).toISOString().split("T")[0];
    const [hour, minute] = startTime.split(":");

    const startDateTime = new Date(
      Date.UTC(
        parseInt(dateString.split("-")[0]),
        parseInt(dateString.split("-")[1]) - 1,
        parseInt(dateString.split("-")[2]),
        parseInt(hour),
        parseInt(minute)
      )
    ).toISOString();
    console.log("Generated startDateTime:", startDateTime);

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Medconsult",
        type: 2,
        start_time: startDateTime,
        duration: 60,
        timezone: "Asia/Kolkata",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          use_pmi: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("response", response);
    const {
      id: meetingId,
      join_url: meetingLink,
      start_time: zoomStartTime,
    } = response.data;

    return {
      meetingId,
      meetingLink,
      startTime: zoomStartTime,
    };
  } catch (error) {
    console.error(
      "Error generating Zoom meeting:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to generate Zoom meeting");
  }
}

module.exports = {
  generateZoomMeeting,
};
