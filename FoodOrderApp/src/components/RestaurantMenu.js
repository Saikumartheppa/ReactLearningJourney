import Shimmer from "./Shimmer";
import { useParams } from "react-router-dom";
import useRestaurantMenu from "../utils/useRestaurantMenu";

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
  return !itemCards ? (
    <Shimmer />
  ) : (
    <div>
      <h1>{name}</h1>
      <h2>
        <span>{`${avgRating}-${costForTwoMessage}`}</span>
      </h2>
      <h3>{cuisines.join(",")}</h3>
      <h4>Outlet - {areaName}</h4>
      <h3>{sla?.slaString}</h3>
      <ul>
        {itemCards.map((item) => (
          <li key={item?.card.info?.id}>
            <h4> {item?.card?.info?.name}</h4>
            <h4> {item?.card?.info?.price / 100}</h4>
            <h4> {item?.card?.info?.ratings?.aggregatedRating?.rating}</h4>
            <h4> {item?.card?.info?.description}</h4>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default RestaurantMenu;
