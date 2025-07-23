import { useState } from "react";
import ItemList from "./ItemList";

const RestaurantCategory = (data) => {
  const[showItems, setShowItems] = useState(null);
  const handleClick = () =>{
    setShowItems(!showItems);
  }
  return (
    <div>
      <div>
        <div className="restaurant-categories">
            <div className="category" onClick={handleClick}>
          <div className="category-title">
            {data?.data?.title}({data?.data?.itemCards?.length})
          </div>
          <div className="downArrow">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 8"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"
              />
            </svg>
          </div>
          </div>
          <div>
           {showItems && <ItemList items={data?.data?.itemCards}/> }
          </div>
        </div>
      </div>
    </div>
  );
};
export default RestaurantCategory;
