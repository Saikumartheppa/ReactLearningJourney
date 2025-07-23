import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestaurantMenu";
import RestaurantCategory from "./RestaurantCategory";

const RestaurantMenu = () => {
  const { resId } = useParams();
  const resInfo = useRestaurantMenu(resId);
  if (!resInfo) {
    return <Shimmer />;
  }
  const { name, areaName, avgRating, costForTwoMessage, cuisines, sla } =
    resInfo?.cards[2]?.card?.card?.info;
  const { itemCards } =
    resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards[2]?.card?.card;
  const categories =
    resInfo?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards.filter(
      (c) =>
        c?.card?.card["@type"] ===
        "type.googleapis.com/swiggy.presentation.food.v2.ItemCategory"
    );
  return !itemCards ? (
    <Shimmer />
  ) : (
    <div className="restaurant-details">
      <div>
        <h1>{name}</h1>
        <h2>
          <span>{`${avgRating}-${costForTwoMessage}`}</span>
        </h2>
        <h3>{cuisines.join(",")}</h3>
        <h4>Outlet - {areaName}</h4>
        <h3>{sla?.slaString}</h3>
        {categories.map((category) => (
          <RestaurantCategory
            key={category?.card?.card?.categoryId}
            data={category?.card?.card}
          />
        ))}
      </div>
    </div>
  );
};
export default RestaurantMenu;
