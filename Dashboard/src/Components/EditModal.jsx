import React, { useState, useRef } from "react";
import Modal from "@material-ui/core/Modal";

const EditModal = ({ prompt, time, updateEntries }) => {
  const [newMessage, setMessage] = useState(newMessage);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleMessage = event => {
    console.log(event.target.value, "VALUE");
    let letter = event.target.value;
    setMessage(letter);
  };

  const editH = event => {
    let newPrompt = newMessage;
    console.log(newMessage, "NEWMESSAGE");
    let newTime = time;

    let obj = { oldPrompt: prompt, Prompt: newPrompt, Time: newTime };

    updateEntries(obj);
    setMessage("");
    setOpen(false);
  };
  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        open={open}
        onClose={handleClose}
      >
        <div className="alert-modal">
          <h2 id="simple-modal-title">
            Edit and click confirm to update your entry
          </h2>
          <form>
            <input
              type="text"
              onChange={handleMessage}
              placeholder="New Entry.."
            />
          </form>
          <div className="buttons">
            <button className="modal-button" onClick={handleClose}>
              Cancel
            </button>
            <button className="modal-button-confirm" onClick={editH}>
              Submit
            </button>
          </div>
        </div>
      </Modal>{" "}
      <button onClick={handleOpen}>Edit</button>
    </div>
  );
};

export default EditModal;
