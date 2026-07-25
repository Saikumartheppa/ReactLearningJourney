import { useState } from "react";
import styles from "./style.module.scss";

const ChipsInput = () => {
  const [inputText, setInputText] = useState("");
  const [chips, setChips] = useState([]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleKeyDown = (e) => {
    const trimmedValue = inputText.trim();

    // Add Chip
    if (e.key === "Enter" && trimmedValue) {
      e.preventDefault();
      setChips((prev) => [...prev, trimmedValue]);
      setInputText("");
    } 
  };

  const handleDeleteChip = (indexToDelete) => {
    setChips((prev) => prev.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className={styles["chips-input"]}>
      {chips?.map((chip, index) => (
        <div key={`${chip}-${index}`} className={styles["chips-input__chip"]}>
          <span>{chip}</span>
          <button
            type="button"
            className={styles["chips-input__delete-btn"]}
            onClick={() => handleDeleteChip(index)}
            aria-label={`Remove ${chip}`}
          >
            ✕
          </button>
        </div>
      ))}

      <input
        type="text"
        className={styles["chips-input__field"]}
        placeholder={chips.length === 0 ? "Type and press Enter..." : ""}
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default ChipsInput;