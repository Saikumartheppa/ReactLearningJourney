import RestaurantCard from "./RestaurantCard";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import useRestaurantList from "../utils/useRestaurantList";

const Body = () => {
  // useState returns an Array . this is same we've used destructuring.
  // const arr = useState(restaurantList);
  // const listOfRestuarants = arr[0];
  // const setListOfRestuarants = arr[1];

  const listOfRestuarants = useRestaurantList();
  const [filteredListOfRestuarantsByName, setFilteredListOfRestuarants] =
    useState([]);
  const [searchInput, setSearchInput] = useState("");
  
  useEffect(()=>{
     setFilteredListOfRestuarants(listOfRestuarants)
  }, [listOfRestuarants])
  // Conditional Rendering
  if (!listOfRestuarants.length) {
    return <Shimmer />;
  }
  return (
    <div className="bodyContainer">
      <div className="search-filter">
        <div className="search-input">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
          ></input>
        </div>
        <button
          className="search-btn"
          onClick={() => {
            const filteredListOfResByName = listOfRestuarants.filter(
              (restuarant) =>
                restuarant?.info?.name
                  ?.toLowerCase()
                  .includes(searchInput.toLowerCase())
            );
            setFilteredListOfRestuarants(filteredListOfResByName);
          }}
          disabled={searchInput.trim().length < 3}
        >
          {" "}
          Search
        </button>
        <button
          className="filter-btn"
          onClick={() => {
            console.log("Button CLicked");
            // Top Rated Restuarants Filter Logic
            const filteredListOfRestuarants = listOfRestuarants
              .filter((restuarant) => restuarant.info.avgRating > 4)
              .sort((a, b) => b.info.avgRating - a.info.avgRating);
            setFilteredListOfRestuarants(filteredListOfRestuarants);
          }}
        >
          Top Rated Restaurants
        </button>
      </div>
      <div className="restaurantContainer">
        {filteredListOfRestuarantsByName.map((restuarant) => (
          //  not using Key <<<<<< Using Index as Key <<<<<< Using uniqueId as a key
          <Link
            key={restuarant?.info?.id}
            to={"/restaurants/" + restuarant?.info?.id}
          >
            <RestaurantCard resData={restuarant} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Body;
