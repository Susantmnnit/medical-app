import React, { useState } from "react";
import axios from "axios";
// import "./SlotModal.css"; // Custom CSS for styling

const SlotModal = ({ show, handleClose, doctorId }) => {
  const token = localStorage.getItem("token");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addSlot`, {
        date,
        startTime,
        endTime,
      },config);
      setMessage({ type: "success", text: "Slot added successfully!" });
      setTimeout(() => {
        setMessage({ type: "success", text: "Slot added successfully!"});
        handleClose();
      }, 2000);
    } catch (error) {
      setMessage({ type: "error", text: "There was an error creating the slot!" });
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Slot</h2>
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <label>
            Start Time:
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </label>
          <label>
            End Time:
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </label>
          <div className="button-group">
            <button type="submit" className="primary">Add Slot</button>
            <button type="button" className="secondary" onClick={handleClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotModal;
