import React from "react";
import axios from "axios";
import List from "./Components/List";
import Form from "./Components/Form";
import Counter from "./Components/Counter";
import { thistle } from "color-name";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      MorningList: [],
      MidDayList: [],
      AfternoonList: [],
      EveningList: [],
      TokenCount: 0,
      string: "",
      edit: "",
      value: ""
    };

    //CRUD
    this.getEntries = this.getEntries.bind(this);
    this.postEntries = this.postEntries.bind(this);
    this.updateEntries = this.updateEntries.bind(this);
    this.deleteEntries = this.deleteEntries.bind(this);
    this.getCount = this.getCount.bind(this);
    //Input Handlers
    this.inputChange = this.inputChange.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getEntries("Morning");
    this.getEntries("MidDay");
    this.getEntries("Evening");
    this.getEntries("Afternoon");
    this.getCount();
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
    this.setState({ edit: value });
  }

  valueChange(event) {
    let value = event.target.value;
    this.setState({ value: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.postEntries({ input: this.state.edit, timeOfDay: this.state.value });
  }

  updateEntries(obj) {
    axios
      .put("/update", obj)
      .then(() => {
        this.getEntries(obj.Time);
      })
      .catch(err => console.log(err));
  }

  deleteEntries(obj) {
    axios
      .delete("/deleteOne", { data: obj })
      .then(() => {
        this.getEntries(obj.Time);
      })
      .catch(err => console.log(err));
  }

  getCount() {
    axios.get("/countTokens").then(({ data }) => {
      this.setState({ TokenCount: data.count });
    });
  }

  render() {
    return (
      <div>
        <h1>Wow What an Amazing Dashboard</h1>
        <div className="counterContainer">
          <Counter counter={this.state.TokenCount} getCount={this.getCount} />
        </div>
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
          deleteEntries={this.deleteEntries}
        />
        <p>MidDay</p>
        <List
          list={this.state.MidDayList}
          updateEntries={this.updateEntries}
          deleteEntries={this.deleteEntries}
        />
        <p>Afternoon</p>
        <List
          list={this.state.AfternoonList}
          updateEntries={this.updateEntries}
          deleteEntries={this.deleteEntries}
        />
        <p>Evening</p>
        <List
          list={this.state.EveningList}
          updateEntries={this.updateEntries}
          deleteEntries={this.deleteEntries}
        />
      </div>
    );
  }
}

export default App;
