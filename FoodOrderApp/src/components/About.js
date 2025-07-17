import React from "react";
import User from "./User";
class About extends React.Component {
  constructor(props) {
    super(props);
    console.log("Parent Constructor");
  }
  componentDidMount() {
    console.log("Parent component did mount");
  }
  render() {
    console.log("Parent render");
    return (
      <div>
        <h1>About</h1>
        <User userName={"HarveySpecter"} location={"Florida"}/>
      </div>
    );
  }
}
export default About;
