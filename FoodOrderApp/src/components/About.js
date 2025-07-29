import React from "react";
import User from "./User";
import UserContext from "../utils/UserContext";
class About extends React.Component {
  constructor(props) {
    super(props);
    // console.log("Parent Constructor");
  }
  async componentDidMount() {
    // console.log("Parent component did mount");
  }
  render() {
    // console.log("Parent render");
    return (
      <div>
        <h1>About</h1>
        <div>Logged user 
          <UserContext.Consumer>
            {({loggedInUser}) => (<h1>{loggedInUser}</h1>)}
            </UserContext.Consumer>
        </div>
        <User />
      </div>
    );
  }
}
export default About;
