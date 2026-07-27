import { useState, useEffect } from "react";
import styles from "./style.module.scss";
const AutoComplete = () => {
  const [searchText, setSeachText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cacheSuggestions, setCacheSuggestions] = useState({});
  const fetchData = async () => {
    if (cacheSuggestions[searchText]) {
      setSuggestions(cacheSuggestions[searchText]);
    } else {
      const response = await fetch(
        `https://dummyjson.com/recipes/search?q=${searchText}`,
      );
      const data = await response.json();
      setSuggestions(data?.recipes);
      setCacheSuggestions((prev) => {
        return { ...prev, [searchText]: data?.recipes };
      });
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);
  return (
    <div className={styles["auto-complete"]}>
      <h2>Auto Complete</h2>
      <input
        className={styles["auto-complete__input-field"]}
        type="text"
        placeholder="Search..."
        onChange={(e) => setSeachText(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setShowSuggestions(false)}
      ></input>
      {showSuggestions && (
        <div className={styles["auto-complete__suggestions-container"]}>
          {suggestions.length ? (
            suggestions.map((suggestion) => {
              return (
                <p
                  key={suggestion.id}
                  className={styles["auto-complete__suggestion"]}
                >
                  {suggestion.name}
                </p>
              );
            })
          ) : (
            <span>
              No Results Available.Please try with different keyword!!!!
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default AutoComplete;
