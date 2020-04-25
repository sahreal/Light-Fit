import React from "react";
import axios from "axios";
import List from "./Components/List";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      MorningList: [],
      MidDayList: [],
      AfternoonList: [],
      EveningList: [],
      TokenCount: [],
      string: "Afternoon",
      list: []
    };

    this.getEntries = this.getEntries.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getEntries("Morning");
    this.getEntries("MidDay");
    this.getEntries("Evening");
    this.getEntries("Afternoon");
  }

  getEntries(string) {
    return axios
      .get("/getAll", {
        params: {
          timeOfDay: string
        }
      })
      .then(result => {
        let list = string + "List";
        this.setState({ [list]: result.data });
      })
      .catch(err => console.log(err));
  }

  handleChange(event) {
    console.log(event.target.value, "HEYNNOEW");
    this.setState({ string: event.target.value });
  }

  handleSubmit(event) {
    alert("Your favorite flavor is: " + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h1>Wow What an Amazing Dashboard</h1>
        <p>Download Ticker/Count Goes Here</p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Pick your favorite flavor:
            <select value={this.state.string} onChange={this.handleChange}>
              <option value="grapefruit">Grapefruit</option>
              <option value="lime">Lime</option>
              <option value="coconut">Coconut</option>
              <option value="mango">Mango</option>
            </select>
          </label>
          <input type="submit" value="Submit" />
        </form>

        <ul>
          Followed by - Get all Entries from Database
          <li>List entires</li>
          <li>Edit/Update button</li>
          <li>Delete Button</li>
        </ul>
        <button onClick={() => this.getEntries}> click me</button>
        <p>Morning</p>
        <List list={this.state.MorningList} />
        <p>MidDay</p>
        <List list={this.state.MidDayList} />
        <p>Afternoon</p>
        <List list={this.state.AfternoonList} />
        <p>Evening</p>
        <List list={this.state.EveningList} />
      </div>
    );
  }
}

export default App;

// postEntries(todo) {
//   axios
//     .post("/todos", todo)
//     .then(() => {
//       this.getTodos();
//     })
//     .catch(err => console.log(err));
// }

// updateEntries(todo) {
//   axios
//     .put("/todos", todo)
//     .then(() => {
//       this.getTodos();
//     })
//     .catch(err => console.log(err));
// }

// deleteEntries(todo) {
//   console.log(todo, "WHAT IS THIS");
//   axios
//     .delete("/todos", { data: { task: todo } })
//     .then(() => this.getTodos())
//     .catch(err => console.log(err));
// }
