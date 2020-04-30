import React from "react";
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
