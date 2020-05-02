import React, { useState, useRef } from "react";
import Modal from "@material-ui/core/Modal";

const EditModal = ({ prompt, time, updateEntries }) => {
  const [newMessage, setMessage] = useState("");
  const [newLink, setLink] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleMessage = event => {
    let letter = event.target.value;
    setMessage(letter);
  };

  const handleLink = event => {
    let link = event.target.value;
    setLink(link);
  };

  const editH = event => {
    let newPrompt = newMessage || "";
    let newTime = time;
    let link = newLink || "";
    let obj = {};

    if (newPrompt === undefined || newPrompt === "") {
      obj = {
        oldPrompt: prompt,
        Prompt: prompt + "\n" + link,
        Time: newTime
      };
    } else {
      obj = {
        oldPrompt: prompt,
        Prompt: newPrompt + "\n" + link,
        Time: newTime
      };
    }

    updateEntries(obj);
    setMessage("");
    setLink("");
    setOpen(false);
  };
  return (
    <div className="delete">
      <Modal
        aria-labelledby="simple-modal-title"
        open={open}
        onClose={handleClose}
      >
        <div className="alert-modal">
          <h2 id="simple-modal-title">Click confirm to update your entry</h2>
          <form>
            <textarea
              defaultValue={prompt}
              rows="5"
              cols="60"
              type="text"
              name="name"
              onChange={handleMessage}
              placeholder="Update text here..."
              style={{ fontSize: "100%" }}
            ></textarea>
            <input
              className="add-video"
              type="text"
              name="link"
              placeholder="If updating link, delete from textbox and enter new link here..."
              onChange={handleLink}
            ></input>
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
      <button className="modal-button-regular" onClick={handleOpen}>
        Edit
      </button>
    </div>
  );
};

export default EditModal;
