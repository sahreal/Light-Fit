import React from "react";
import ListEntry from "./ListEntry";

const List = ({ list, updateEntries, deleteEntries, deleteHandler }) => {
  return (
    <div>
      {list.length > 0
        ? list.map((item, index) => {
            return (
              <ListEntry
                key={index}
                prompt={item.Prompt}
                time={item.Time}
                updateEntries={updateEntries}
                deleteEntries={deleteEntries}
                deleteHandler={deleteHandler}
              />
            );
          })
        : null}
    </div>
  );
};

export default List;
