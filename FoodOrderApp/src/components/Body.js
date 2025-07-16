import RestaurantCard from "./RestaurantCard";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
import { Link } from "react-router-dom";
import { RESTAURANT_LIST_API } from "../utils/constants";
const Body = () => {
  // useState returns an Array . this is same we've used destructuring.
  // const arr = useState(restaurantList);
  // const listOfRestuarants = arr[0];
  // const setListOfRestuarants = arr[1];

  const [listOfRestuarants, setListOfRestuarants] = useState([]);
  const [filteredListOfRestuarantsByName, setFilteredListOfRestuarants] =
    useState([]);
  const [searchInput, setSearchInput] = useState("");
  const fetchData = async () => {
    const data = await fetch(RESTAURANT_LIST_API);
    const json = await data.json();
    // optional chaining
    setListOfRestuarants(
      json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    setFilteredListOfRestuarants(
      json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Conditional Rendering
  if (listOfRestuarants.length === 0) {
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
              .sort((a, b) => a.info.avgRating - b.info.avgRating);
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
