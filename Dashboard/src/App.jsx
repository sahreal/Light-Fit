import React from "react";
import axios from "axios";
import List from "./Components/List";
import Form from "./Components/Form";
import Counter from "./Components/Counter";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
      entry: "",
      link: "",
      timeOfDay: "",
      emojis: [],
      loading: true
    };

    //CRUD
    this.getEntries = this.getEntries.bind(this);
    this.postEntries = this.postEntries.bind(this);
    this.updateEntries = this.updateEntries.bind(this);
    this.deleteEntries = this.deleteEntries.bind(this);
    this.getCount = this.getCount.bind(this);
    //Input Handlers
    this.inputChange = this.inputChange.bind(this);
    this.timeOfDayChange = this.timeOfDayChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateEmoji = this.updateEmoji.bind(this);
  }

  componentDidMount() {
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
    this.setState({ loading: true });
    axios
      .post("/postOne", newMessage)
      .then(() => {
        this.getEntries(this.state.timeOfDay);
        this.setState({ loading: false });
      })
      .catch(err => console.log(err));
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
      this.setState({ loading: false });
    });
  }

  inputChange(event) {
    let name = event.target.name;
    let value = event.target.value;

    this.setState({ [name]: value });
  }

  timeOfDayChange(event) {
    let value = event.target.value;
    this.setState({ timeOfDay: value });
  }

  handleSubmit(event) {
    this.postEntries({
      input:
        this.state.entry + this.state.emojis.join("") + "\n" + this.state.link,
      timeOfDay: this.state.timeOfDay
    });
    this.setState({ emojis: [] });
  }

  updateEmoji(newArray) {
    this.setState({ emojis: newArray });
  }

  render() {
    const loading = this.state.loading;

    if (loading) {
      return null;
    }
    return (
      <div>
        <h1>Light + Fit SlackApp Dashboard</h1>
        <div className="counterContainer">
          <Counter counter={this.state.TokenCount} getCount={this.getCount} />
        </div>
        <Form
          handleSubmit={this.handleSubmit}
          timeOfDayChange={this.timeOfDayChange}
          inputChange={this.inputChange}
          value={this.state.value}
          edit={this.state.edit}
          emojis={this.state.emojis}
          updateEmoji={this.updateEmoji}
        />
        <div className="expansion">
          <ExpansionPanel onClick={() => this.getEntries("Morning")}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="time-of-day-list">Morning</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List
                className="actual-list"
                list={this.state.MorningList}
                updateEntries={this.updateEntries}
                deleteEntries={this.deleteEntries}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel onClick={() => this.getEntries("MidDay")}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="time-of-day-list">Mid-Day</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List
                list={this.state.MidDayList}
                updateEntries={this.updateEntries}
                deleteEntries={this.deleteEntries}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel onClick={() => this.getEntries("Afternoon")}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="time-of-day-list">Afternoon</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List
                list={this.state.AfternoonList}
                updateEntries={this.updateEntries}
                deleteEntries={this.deleteEntries}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel onClick={() => this.getEntries("Evening")}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="time-of-day-list">Evening</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List
                list={this.state.EveningList}
                updateEntries={this.updateEntries}
                deleteEntries={this.deleteEntries}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </div>
    );
  }
}

export default App;
