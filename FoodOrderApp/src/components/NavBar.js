import { LOGO_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../utils/UserContext";

const NavBar = () => {
  const {loggedInUser} = useContext(UserContext);
  return (
    <div className="nav">
      <div className="navItems">
        <div className="logo">
          <img src={LOGO_URL} />
        </div>
        <div className="items">
          <ul>
            <Link to={"/"}><li>Home</li> </Link>
           <Link to="/about"><li>About</li></Link>
            <Link to={"/contact"}><li>Contact US</li></Link>
            <li>Cart</li>
            <li>{loggedInUser}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default NavBar;