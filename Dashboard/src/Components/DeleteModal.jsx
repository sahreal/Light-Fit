import React, { useState, useRef } from "react";
import Modal from "@material-ui/core/Modal";

const DeleteModal = ({ prompt, time, deleteEntries }) => {
  const [open, setOpen] = useState(false);
  //const valueRef = useRef(time);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteH = event => {
    let obj = {
      Prompt: prompt,
      Time: time
    };

    deleteEntries(obj);
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
          <h2 id="simple-modal-title">
            Are you sure you want to delete this {time} entry?
          </h2>
          <div className="buttons">
            <button className="modal-button" onClick={handleClose}>
              Cancel
            </button>
            <button
              className="modal-button-confirm"
              value={prompt}
              onClick={deleteH}
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
      <button
        className="modal-button-regular"
        value={prompt}
        onClick={handleOpen}
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteModal;
