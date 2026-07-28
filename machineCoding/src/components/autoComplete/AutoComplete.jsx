import { useState, useEffect } from "react";
import styles from "./style.module.scss";
const SuggestionsList = ({ loading, suggestions, onSelect}) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!suggestions.length) {
    return <p>No Results Available.</p>;
  }

  return suggestions.map((suggestion) => (
    <p
      key={suggestion.id}
      className={styles["auto-complete__suggestion"]}
      onMouseDown={()=> 
        onSelect(suggestion)
    }
    >
      {suggestion.name}
    </p>
  ));
}
const AutoComplete = () => {
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cacheSuggestions, setCacheSuggestions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const handleSelect = (suggestion) => {
     setSearchText(suggestion.name);
  }
  const fetchData = async () => {
    const trimmedSearchValue = searchText.trim();
    if (!trimmedSearchValue) {
      setSuggestions([]);
      return;
    }
    if (cacheSuggestions[trimmedSearchValue]) {
      setSuggestions(cacheSuggestions[trimmedSearchValue]);
    } else {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://dummyjson.com/recipes/search?q=${trimmedSearchValue}`,
        );
        const data = await response.json();
        setSuggestions(data?.recipes);
        setCacheSuggestions((prev) => {
          return { ...prev, [trimmedSearchValue]: data?.recipes };
        });
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
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
        value={searchText}
        placeholder="Search..."
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() =>  {
            setShowSuggestions(false);
            setSearchText("");
            setSuggestions([]);
        }
        }
      ></input>
      {showSuggestions && (
        <div className={styles["auto-complete__suggestions-container"]} onMouseDown={(e) => e.preventDefault()}>
         <SuggestionsList loading={isLoading} suggestions={suggestions} onSelect={handleSelect}/>
        </div>
      )}
    </div>
  );
};
export default AutoComplete;
