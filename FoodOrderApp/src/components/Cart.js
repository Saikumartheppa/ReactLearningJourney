import { useDispatch, useSelector } from "react-redux";
import ItemList from "./ItemList";
import { clearCart } from "../utils/cartSlice";
import { Link } from "react-router-dom";
import { CART_EMPTY_IMAGE } from "../utils/constants";
import "../../style.css";

const Cart = () => {
  const cartItems = useSelector((store) => store.cart.items);
  const dispatch = useDispatch();
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  return (
    <div
      className={`cart-container ${cartItems.length === 0 ? "empty-cart" : ""}`}
    >
      <h1>Cart</h1>
      <div className="clear-cart">
        <button onClick={handleClearCart} disabled={cartItems?.length === 0}>
          CLEAR CART
        </button>
      </div>
      {cartItems.length === 0 && (
        <div className="empty-cart">
          <div className="empty-cart-img">
            <img
              src={
                CART_EMPTY_IMAGE
              }
              alt="Empty-image"
            />
          </div>
          <div>
            <h2>Your cart is empty</h2>
            <h4>You can go to home page to view more restaurants</h4>
          </div>
          <div className="restaurants-near-you">
            <Link to={"/"}>
              <button>SEE RESTAURANTS NEAR YOU</button>
            </Link>
          </div>
        </div>
      )}
      <div>
        <ItemList items={cartItems}></ItemList>
      </div>
    </div>
  );
};
export default Cart;
