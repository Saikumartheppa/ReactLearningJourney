import { Component } from "react";
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo:{
        name : "Dummy Name",
        location : "Dummy Location"
      }
    };
    console.log("Child Constructor");
  }
  async componentDidMount() {
    const data = await fetch("https://api.github.com/users/Saikumartheppa");
    const json = await data.json();
    this.setState({
      userInfo: json
    })
    setInterval(()=>{
      console.log("Set Interval");
    }, 1000)
    console.log("Child component did mount");
  }
  componentDidUpdate(){
    console.log("Component Updated");
  }
  componentWillUnmount(){
    console.log("Component UnMounted");
  }
  render() {
    const { name, location , avatar_url } = this?.state?.userInfo;
    console.log("Child render");
    return (
      <div>
        <img src={avatar_url}></img>
        <h1>User Name : {name}</h1>
        <h1>Location : {location}</h1>
      </div>
    );
  }
}
export default User;
