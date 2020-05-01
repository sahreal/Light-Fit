import React from "react";
import "../styles.css";

const ListEntry = ({ prompt, id }) => {
  return (
    <div className="text">
      <span>
        <p className="entry-id">{id}</p>
        <p>{prompt}</p>
      </span>
    </div>
  );
};

export default ListEntry;
