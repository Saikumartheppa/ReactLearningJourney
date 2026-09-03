import { TODO_FILTER_BUTTONS as todoFilterBtns } from "../constants";
import styles from "./style.module.scss";
const TodoFilters = (props) => {
  const { appliedFilter, setFilter } = props;
  return (
    <>
      {todoFilterBtns.map((buttonLabel) => {
        return (
          <button
            key={buttonLabel}
            className={`${styles["todo--filterBtn"]} ${appliedFilter === buttonLabel ? styles["todo--appliedFilter"] : ""}`}
            onClick={() => setFilter(buttonLabel)}
          >
            {buttonLabel}
          </button>
        );
      })}
    </>
  );
};
export default TodoFilters;
