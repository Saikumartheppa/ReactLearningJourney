import Search from "./Search";
import RestaurantCard from "./RestuarantCard";
import restaurantList from "../utils/mockData";

const Body = () => {
  return (
    <div className="bodyContainer">
      <Search />
      <div className="restaurantContainer">
        {restaurantList.map((restuarant) => (
          //  not using Key <<<<<< Using Index as Key <<<<<< Using uniqueId as a key
          <RestaurantCard key={restuarant.data.id} resData={restuarant} />
        ))}
      </div>
    </div>
  );
};

export default Body;