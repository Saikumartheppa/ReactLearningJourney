import { Component } from "react";
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: this.props.userName,
      location: this.props.location,
      count: 0,
    };
    console.log("Child Constructor");
  }
  componentDidMount() {
    console.log("Child component did mount");
  }
  render() {
    const { userName, location } = this?.props;
    const { count } = this.state;
    console.log("Child Constructor");
    return (
      <div>
        <h1>Count : {count}</h1>
        <button
          className="count-btn"
          onClick={() => {
            this.setState({
              count: this.state.count + 1,
            });
          }}
        >
          Count Increase
        </button>
        <h1>User Name : {userName}</h1>
        <h1>Location : {location}</h1>
      </div>
    );
  }
}
export default User;
