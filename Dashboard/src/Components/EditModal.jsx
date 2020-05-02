import React, { useState, useRef } from "react";
import Modal from "@material-ui/core/Modal";

const EditModal = ({ prompt, time, updateEntries }) => {
  const [newMessage, setMessage] = useState(newMessage);
  const [newLink, setLink] = useState(newLink);
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
    let newPrompt = newMessage;

    let newTime = time;
    let obj = {};
    if (newMessage === undefined) {
      obj = {
        oldPrompt: prompt,
        Prompt: prompt + "\n" + newLink,
        Time: newTime
      };
    } else {
      obj = {
        oldPrompt: prompt,
        Prompt: newPrompt + "\n" + newLink,
        Time: newTime
      };
    }
    console.log(obj, "this obj");
    updateEntries(obj);
    // setMessage("");
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
              rows="5"
              defaultValue={prompt}
              cols="60"
              type="text"
              name="name"
              onChange={handleMessage}
              placeholder="Update text here..."
              style={{ fontSize: "100%" }}
            >
              {prompt}
            </textarea>
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
