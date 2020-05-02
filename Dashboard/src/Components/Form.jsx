import React from "react";
import EmojiPicker from "./EmojiPicker";

function Form({
  handleSubmit,
  timeOfDayChange,
  inputChange,
  value,
  emojis,
  updateEmoji
}) {
  return (
    <div className="form">
      <form>
        <label>
          <textarea
            className="textarea"
            rows="5"
            cols="60"
            type="text"
            name="entry"
            onChange={inputChange}
            placeholder="Add new entry, select a time of day, click submit..."
            style={{ fontSize: "100%", borderRadius: "10px" }}
          ></textarea>
          <input
            className="add-video"
            type="text"
            name="link"
            placeholder="Add video link here..."
            onChange={inputChange}
            style={{ color: "blue" }}
          ></input>
        </label>
      </form>
      <form onSubmit={handleSubmit}>
        <label>
          <div className="select-words"> Select Time of Day:</div>
          <select
            className="select-selected"
            name="timeOfDay"
            value={value}
            onChange={timeOfDayChange}
          >
            <option value="" disable="true">
              ---
            </option>
            <option value="Morning">Morning</option>
            <option value="MidDay">MidDay</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </label>
        <input
          className="modal-button-regular"
          type="submit"
          value="Submit"
          style={{ margin: "0px" }}
        />
      </form>
      <div style={{ color: "whitesmoke", margin: "0px 10px" }}>
        *Emojis can only be added to the end of entries*
      </div>
      <EmojiPicker emojis={emojis} updateEmoji={updateEmoji} />
    </div>
  );
}

export default Form;
