import Search from "./Search";
import RestaurantCard from "./RestuarantCard";
import restaurantList from "../utils/mockData";
import { useState } from "react";

const Body = () => {
    // useState returns an Array . this is same we've used destructuring.
    // const arr = useState(restaurantList);
    // const listOfRestuarants = arr[0];
    // const setListOfRestuarants = arr[1];

    const [listOfRestuarants, setListOfRestuarants] = useState(restaurantList);
  return (
    <div className="bodyContainer">
      <div className="search-filter">
        <Search />
        <button
          className="filter-btn"
          onClick={() => {
            console.log("Button CLicked");
            // Top Rated Restuarants Filter Logic
            const filteredListOfRestuarants = listOfRestuarants.filter((restuarant) =>  restuarant.data.avgRating > 4);
            setListOfRestuarants(filteredListOfRestuarants);
          }}
        >
          Top Rated Restaurants
        </button>
      </div>
      <div className="restaurantContainer">
        {listOfRestuarants.map((restuarant) => (
          //  not using Key <<<<<< Using Index as Key <<<<<< Using uniqueId as a key
          <RestaurantCard key={restuarant.data.id} resData={restuarant} />
        ))}
      </div>
    </div>
  );
};

export default Body;
