import { useState } from "react";
import styles from "./style.module.scss";

const ChipsInput = () => {
  const [inputText, setInputText] = useState("");
  const [chips, setChips] = useState([]);
  const [selectedChipIndex, setSelectedChipIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const separators = [",", " ", ";"];

  const deleteChip = (indexToDelete) => {
    setChips((prev) => prev.filter((_, index) => index !== indexToDelete));
  };
  const addChips = (values) => {
    setChips((prev) => {
      const seen = new Set(prev);

      const newChips = values
        .filter((value) => {
          const chip = value.trim();

          if (!chip || seen.has(chip)) {
            return false;
          }

          seen.add(chip);
          return true;
        })
        .map((chip) => chip.trim());

      return [...prev, ...newChips];
    });

    setInputText("");
  };
  const handleInputChange = (e) => {
    setInputText(e.target.value);
    if (selectedChipIndex !== null) {
      setSelectedChipIndex(null);
    }
    if(editingIndex !== null){
       setEditingIndex(null);
       setEditingValue('');
    }
  };

  const handleKeyDown = (e) => {
    const trimmedValue = inputText.trim();

    // Add Chip
    if (e.key === "Enter") {
      e.preventDefault();
      if (trimmedValue) {
        addChips([trimmedValue]);
      }
      return;
    }
    // follow up 3 : If user clicks on keys like "," , " " , ";". add the chip
    if (separators.includes(e.key)) {
      e.preventDefault();

      if (trimmedValue) {
        addChips([trimmedValue]);
      }
      return;
    }
    // Follow up Question 1 :  Delete last chip on backspace if input is empty
    // else if (e.key === "Backspace" && !inputText && chips.length > 0) {
    //   setChips((prev) => prev.slice(0, -1));
    // }
    // Follow Up Question 2 : Pressing back space twice deletes a last chip , single press focuses the last chip
    if (e.key === "Backspace" && !inputText && chips.length > 0) {
      if (selectedChipIndex === null) {
        setSelectedChipIndex(chips.length - 1);
      } else {
        handleDeleteChip(selectedChipIndex);
        setSelectedChipIndex(null);
      }
    }
  };

  const handleDeleteChip = (indexToDelete) => {
    deleteChip(indexToDelete);
    if (editingIndex === null) return;
    if (editingIndex === indexToDelete) {
      setEditingIndex(null);
      setEditingValue("");
    } else if (indexToDelete < editingIndex) {
      setEditingIndex((prev) => prev - 1);
    }
  };
  // follow up 4 : If user copy & paste's values from note pad or some where.
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    const values = pastedText.split(/[,\n;\n' ']/);

    addChips(values);
  };
  const handleEdit = (indexToBeEdited) => {
    setEditingIndex(indexToBeEdited);
    setEditingValue(chips[indexToBeEdited]);
  };
  // follow up 5 : Double clicking on a chip results editable option
  const saveChip = (e) => {
    if (e.key === "Enter") {
      const value = editingValue.trim();

      if (!value) {
        setEditingIndex(null);
        return;
      }

      setChips((prev) => {
        // Ignore the chip currently being edited
        const duplicate = prev.some(
          (chip, index) => index !== editingIndex && chip === value,
        );

        if (duplicate) {
          return prev;
        }

        return prev.map((chip, index) =>
          index === editingIndex ? value : chip,
        );
      });

      setEditingIndex(null);
      setEditingValue("");
    }
  };
  return (
    <div className={styles["chips-input"]}>
      {chips?.map((chip, index) => (
        <div
          key={`${chip}-${index}`}
          className={`${styles["chips-input__chip"]} ${selectedChipIndex === index ? styles["chips-input__chip--selected"] : ""}`}
        >
          {editingIndex === index ? (
            <input
              style={{
                outline: "none",
                border: "none",
                backgroundColor: "#e0e0e0",
              }}
              value={editingValue}
              autoFocus
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={saveChip}
            />
          ) : (
            <span onDoubleClick={() => handleEdit(index)}>{chip}</span>
          )}
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
        onPaste={handlePaste}
      />
    </div>
  );
};

export default ChipsInput;
