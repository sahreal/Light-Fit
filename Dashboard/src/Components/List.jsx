import React from "react";
import ListEntry from "./ListEntry";

function List({ list }) {
  return (
    <div>
      {list.map((item, index) => {
        return <ListEntry key={index} prompt={item.Prompt} time={item.Time} />;
      })}
    </div>
  );
}

export default List;
