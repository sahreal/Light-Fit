import React from "react";

function ListEntry({ prompt, time }) {
  return (
    <div>
      <span>
        {" "}
        <strong>{time}</strong>
        ----------
        {prompt}
      </span>
      <div>
        <button>Update</button>
        <button>Delete</button>
      </div>
    </div>
  );
}

export default ListEntry;
