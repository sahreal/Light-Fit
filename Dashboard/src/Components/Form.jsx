import React from "react";

function Form({ handleSubmit, valueChange, inputChange, value }) {
  return (
    <div>
      <form>
        <label>
          Add new prompt:
          <input type="text" name="name" onChange={inputChange} />
        </label>
      </form>
      <form onSubmit={handleSubmit}>
        <label>
          Select Time of Day:
          <select value={value} onChange={valueChange}>
            <option value="" disable="true">
              ---
            </option>
            <option value="Morning">Morning</option>
            <option value="MidDay">MidDay</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Form;
