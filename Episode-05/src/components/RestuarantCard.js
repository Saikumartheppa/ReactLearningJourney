const RestaurantCard = (props) => {
  const { resData } = props;
  const {imageUrl, name, avgRating, cuisines, costForTwoString, deliveryTime } = resData?.data;
  return (
    <div className="restuarantCard">
      <img src={imageUrl}></img>
      <h3>{name}</h3>
      <h4>{cuisines.join(", ")}</h4>
      <h4>{avgRating} stars</h4>
      <h4>₹{costForTwoString}</h4>
      <h4>{deliveryTime} Minutes</h4>
    </div>
  );
};
export default RestaurantCard;