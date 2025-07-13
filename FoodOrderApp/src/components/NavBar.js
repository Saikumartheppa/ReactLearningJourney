import { LOGO_URL } from "../utils/constants";

const NavBar = () => {
  return (
    <div className="nav">
      <div className="navItems">
        <div className="logo">
          <img src={LOGO_URL} />
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
export default NavBar;