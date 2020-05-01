import React from "react";
import CheckIcon from "@material-ui/icons/Check";

function Form({ handleSubmit, valueChange, inputChange, value }) {
  return (
    <div className="form">
      <form>
        <label>
          <textarea
            className="textarea"
            rows="5"
            cols="60"
            type="text"
            name="name"
            onChange={inputChange}
            placeholder="Add new entry, select a time of day, click submit..."
            style={{ "font-size": "100%" }}
          ></textarea>
        </label>
      </form>
      <form onSubmit={handleSubmit}>
        <label style={{ color: "whitesmoke" }}>
          <div className="select-words"> Select Time of Day:</div>
          <select
            className="select-selected"
            value={value}
            onChange={valueChange}
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
        <div>
          Successful submit
          <CheckIcon />
        </div>
      </form>
    </div>
  );
}

export default Form;
