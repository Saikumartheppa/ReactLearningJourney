import RestaurantCard from "./RestuarantCard";
import { useState, useEffect } from "react";
import Shimmer from "./Shimmer";
const Body = () => {
  // useState returns an Array . this is same we've used destructuring.
  // const arr = useState(restaurantList);
  // const listOfRestuarants = arr[0];
  // const setListOfRestuarants = arr[1];

  const [listOfRestuarants, setListOfRestuarants] = useState([]);
  const [filteredListOfRestuarantsByName, setFilteredListOfRestuarantsByName] =
    useState([]);
  const [searchInput, setSearchInput] = useState("");
  const fetchData = async () => {
    const data = await fetch(
      "https://www.swiggy.com/dapi/restaurants/list/v5?lat=12.9351929&lng=77.62448069999999&page_type=DESKTOP_WEB_LISTING"
    );
    const json = await data.json();
    // optional chaining
    setListOfRestuarants(
      json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
    setFilteredListOfRestuarantsByName(
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
            setFilteredListOfRestuarantsByName(filteredListOfResByName);
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
            setListOfRestuarants(filteredListOfRestuarants);
          }}
        >
          Top Rated Restaurants
        </button>
      </div>
      <div className="restaurantContainer">
        {filteredListOfRestuarantsByName.map((restuarant) => (
          //  not using Key <<<<<< Using Index as Key <<<<<< Using uniqueId as a key
          <RestaurantCard key={restuarant?.info?.id} resData={restuarant} />
        ))}
      </div>
    </div>
  );
};

export default Body;
