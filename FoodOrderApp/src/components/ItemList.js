import { useDispatch } from "react-redux";
import { IMAGE_URL } from "../utils/constants";
import { addItem } from "../utils/cartSlice";
const ItemList = ({ items }) => {
  const dispatch = useDispatch();
  const handleAddItem = (item) => {
      dispatch(addItem(item));
  }
  return (
    <div>
      {items?.map((item) => (
        <div key={item?.card?.info?.id} className="item-container"> 
          <div className="item">
            <div className="item-name">{item?.card?.info?.name}</div>
            <div className="item-price">₹{item?.card?.info?.price ? item?.card?.info?.price / 100 : item?.card?.info?.defaultPrice / 100}</div>
            <div className="item-description">
              <p> {item?.card?.info?.description}</p>
            </div>
          </div>
          <div>
            <div className="add-btn">
              <button onClick={() => handleAddItem(item)}>ADD</button>
            </div>
            <div className="item-image">
                <img src={IMAGE_URL + item?.card?.info?.imageId}/>
            </div>
            </div>
        </div>
      ))}
    </div>
  );
};
export default ItemList;
