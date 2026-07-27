import { useState , useEffect } from "react";
import styles from "./style.module.scss";
const AutoComplete = () => {
   const [searchText , setSeachText] = useState('');
   const [suggestions , setSuggestions] = useState([]);
   const fetchData = async ()=>{
      const response = await fetch(`https://dummyjson.com/recipes/search?q=${searchText}`);
      const data = await response.json();
      setSuggestions(data?.recipes);
      console.log(data.recipes);
   }
   useEffect(() => {
     fetchData();
   }, [searchText])
   return (
    <div className={styles["auto-complete"]}>
        <h2>Auto Complete</h2>
        <input className={styles["auto-complete__input-field"]} type="text" placeholder="Search..." onChange={(e) => setSeachText(e.target.value)}></input>
        <div className={styles["auto-complete__suggestions-container"]}>
            {suggestions.map((suggestion) => {
               return <p key={suggestion.id} className={styles["auto-complete__suggestion"]}>{suggestion.name}</p>
            })}
        </div>
    </div>
   )
}
export default AutoComplete;