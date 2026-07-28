import { useState, useEffect , useRef } from "react";
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
  const abortControllerRef = useRef(null);
  const handleSelect = (suggestion) => {
     setSearchText(suggestion.name);
  }
  const fetchData = async (query) => {
    if (!query) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    // Cache hit
    if (cacheSuggestions[query]) {
      setSuggestions(cacheSuggestions[query]);
      return;
    }
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://dummyjson.com/recipes/search?q=${query}`,
        {
          signal: controller.signal,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      setSuggestions(data.recipes);
      setCacheSuggestions((prev) => {
          return { ...prev, [query]: data?.recipes };
        });
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      console.error(error);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    const query = searchText.trim().toLowerCase();
    const timer = setTimeout(() => {
      fetchData(query);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);
  useEffect(() => {
    return () => {
        abortControllerRef.current?.abort();
    };
}, []);
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
