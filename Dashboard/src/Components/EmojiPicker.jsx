import React, { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

const EmojiPicker = ({ emojis, updateEmoji }) => {
  const handleSelect = emoji => {
    let newArr = emojis.concat(emoji.native);
    updateEmoji(newArr);
  };

  const deleteEmoji = () => {
    let newArr = emojis.slice(0, -1);
    updateEmoji(newArr);
  };

  return (
    <div className="emoji-picker">
      <Picker
        title="Pick your emoji…"
        emoji="point_up"
        onSelect={handleSelect}
      />
      <div>
        <p style={{ margin: "10px" }}>Your Selected Emojis:</p>
        <button className="emoji-button" onClick={deleteEmoji}>
          {" "}
          {emojis}
        </button>
        <p style={{ margin: "10px" }}>Click Emojis to delete</p>
      </div>
    </div>
  );
};

export default EmojiPicker;
