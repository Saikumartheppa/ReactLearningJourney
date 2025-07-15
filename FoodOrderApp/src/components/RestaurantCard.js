import { IMAGE_URL } from "../utils/constants";

const RestaurantCard = (props) => {
  const { resData } = props;
  const { cloudinaryImageId, name, avgRating, cuisines, costForTwo, sla} =
    resData?.info;
  return (
    <div className="restuarantCard">
      <img src={`${IMAGE_URL}${cloudinaryImageId}`}></img>
      <h3>{name}</h3>
      <h4>{cuisines.join(", ")}</h4>
      <h4>{avgRating} stars</h4>
      <h4>{costForTwo}</h4>
      <h4>{sla?.deliveryTime} Minutes</h4>
    </div>
  );
};
export default RestaurantCard;
