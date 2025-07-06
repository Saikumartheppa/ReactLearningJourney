import React from "react";
import ReactDOM from "react-dom/client";
import restaurantList from "./RestuarantList";
import logo from "./logo.jpg";

const NavBar = () => {
  return (
    <div className="nav">
      <div className="navItems">
        {/* Image not reflecting in the UI need to look into this */}
        {/* <img className="Logo" src={logo.default} alt="Food App Logo" style={{
        width: '100px',
        height: '100px',
        border: '5px solid red'
    }} /> */}
        <div className="logo">
          <img src="https://graphicsfamily.com/wp-content/uploads/edd/2023/02/Restaurant-Logo-Design-2-2048x1152.jpg" />
        </div>
        <div className="items">
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact US</li>
            <li>Cart</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
const AppLayOut = () => {
  console.log("App is Running");
  return (
    <div className="appContainer">
      <NavBar />
      {/* <Body />
      <Footer /> */}
    </div>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<AppLayOut />);
