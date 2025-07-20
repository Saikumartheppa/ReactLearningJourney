import { RESTAURANT_LIST_API } from "./constants";
import { useState, useEffect } from "react";
const useRestaurantList = () => {
  const [listOfRestuarants, setListOfRestuarants] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    
    const data = await fetch(RESTAURANT_LIST_API);
    const json = await data.json();
    // optional chaining
    setListOfRestuarants(
      json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants
    );
  };

  return listOfRestuarants;
};
export default useRestaurantList;
