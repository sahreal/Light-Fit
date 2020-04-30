import React, { useState, useRef } from "react";
import "@babel/polyfill";
import { set } from "mongoose";

const ListEntry = ({ prompt, time, deleteEntries }) => {
  const valueRef = React.useRef(time);

  const deleteH = e => {
    let prompt = event.target.value;
    let time = valueRef.current;

    let obj = {
      Prompt: prompt,
      Time: time
    };

    deleteEntries(obj);
  };

  return (
    <div>
      <span>
        {" "}
        <strong>{valueRef.current}</strong>
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
