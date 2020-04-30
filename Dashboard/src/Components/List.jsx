import React from "react";
import ListEntry from "./ListEntry";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";

const List = ({ list, updateEntries, deleteEntries }) => {
  return (
    <div>
      {list.length > 0
        ? list.map((item, index) => {
            return (
              <div key={index}>
                <ListEntry
                  prompt={item.Prompt}
                  time={item.Time}
                  updateEntries={updateEntries}
                  deleteEntries={deleteEntries}
                />
                <DeleteModal
                  prompt={item.Prompt}
                  time={item.Time}
                  deleteEntries={deleteEntries}
                />
                <EditModal
                  prompt={item.Prompt}
                  time={item.Time}
                  updateEntries={updateEntries}
                />
              </div>
            );
          })
        : null}
    </div>
  );
};

export default List;
