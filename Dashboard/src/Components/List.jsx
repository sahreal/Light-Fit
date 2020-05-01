import React from "react";
import ListEntry from "./ListEntry";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";

const List = ({ list, updateEntries, deleteEntries }) => {
  return (
    <div className="list-div">
      {list.length > 0
        ? list.map((item, index) => {
            let id = list.length;
            return (
              <div className="cell" key={index}>
                <ListEntry
                  prompt={item.Prompt}
                  time={item.Time}
                  updateEntries={updateEntries}
                  deleteEntries={deleteEntries}
                  id={index + 1}
                />
                <EditModal
                  prompt={item.Prompt}
                  time={item.Time}
                  updateEntries={updateEntries}
                />
                <DeleteModal
                  prompt={item.Prompt}
                  time={item.Time}
                  deleteEntries={deleteEntries}
                />
              </div>
            );
          })
        : null}
    </div>
  );
};

export default List;
