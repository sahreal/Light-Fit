import React from "react";
// import "@babel/polyfill";

const ListEntry = ({ prompt, time, deleteHandler }) => {
  const deleteH = (event) => {
    console.log(event.target);
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
