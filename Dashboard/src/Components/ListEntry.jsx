import React from "react";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import "../styles.css";

const ListEntry = ({ prompt, time }) => {
  return (
    <div>
      <span>
        {prompt}
        ------
        <strong>{time}</strong>
      </span>
    </div>
  );
};

export default ListEntry;
