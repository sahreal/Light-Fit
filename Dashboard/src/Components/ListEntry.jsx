import React, { useState } from "react";
import "@babel/polyfill";
import { set } from "mongoose";

const ListEntry = ({ prompt, time, deleteHandler }) => {
  const deleteH = event => {
    console.log(event.target);
  };

  return (
    <div>
      <span>
        {" "}
        <strong>{time}</strong>
        --------
        {prompt}
      </span>

      <div>
        <button value={prompt} onClick={deleteH}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ListEntry;
