import React from "react";
import axios from "axios";
import List from "./Components/List";
import Form from "./Components/Form";
import { thistle } from "color-name";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      MorningList: [],
      MidDayList: [],
      AfternoonList: [],
      EveningList: [],
      TokenCount: [],
      string: "",
      edit: "",
      value: ""
    };

    //CRUD
    this.getEntries = this.getEntries.bind(this);
    this.postEntries = this.postEntries.bind(this);
    this.updateEntries = this.updateEntries.bind(this);
    this.deleteEntries = this.deleteEntries.bind(this);
    //Input Handlers
    this.inputChange = this.inputChange.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
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

  postEntries(newMessage) {
    axios
      .post("/postOne", newMessage)
      .then(() => {
        this.getEntries(this.state.value);
      })
      .catch(err => console.log(err));
  }

  inputChange(event) {
    let value = event.target.value;
    console.log(value, "TYPE TTYP");
    this.setState({ edit: value });
  }

  valueChange(event) {
    let value = event.target.value;
    console.log(value, "enter Select");
    this.setState({ value: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.postEntries({ input: this.state.edit, timeOfDay: this.state.value });
  }

  updateEntries(obj) {
    console.log(obj, "WHAT NOW");
    // axios
    //   .put("/update", obj)
    //   .then(() => {
    //     this.getEntries(obj.Time);
    //   })
    //   .catch(err => console.log(err));
  }

  deleteEntries(message) {
    console.log(message, "WHAT IS THIS");
    // axios
    //   .delete("/todos", { data: { task: todo } })
    //   .then(() => this.getTodos())
    //   .catch(err => console.log(err));
  }

  deleteHandler(prompt) {
    console.log(ref.current, " hhhh");
  }

  render() {
    return (
      <div>
        <h1>Wow What an Amazing Dashboard</h1>
        <p>Download Ticker/Count Goes Here</p>
        <Form
          handleSubmit={this.handleSubmit}
          valueChange={this.valueChange}
          inputChange={this.inputChange}
          value={this.state.value}
          edit={this.state.edit}
        />

        <p>Morning</p>
        <List
          list={this.state.MorningList}
          updateEntries={this.updateEntries}
          deleteHandler={this.deleteHandler}
          deleteEntries={this.deleteEntries}
        />
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
