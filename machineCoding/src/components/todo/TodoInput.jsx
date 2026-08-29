import styles from "./style.module.scss";
const TodoInput = (props) => {
  const { todoInputField, handleInputField , handleAddTodoItem } = props;
  return (
    <div className={styles["todo__input-container"]}>
      <input
        className={styles["todo__input-field"]}
        placeholder="Please enter your todo title"
        type="text"
        value={todoInputField}
        onChange={(e) => handleInputField(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAddTodoItem(e.target.value)}
      />
      <button className={styles["todo__add"]} onClick={() => handleAddTodoItem(todoInputField)}>Add</button>
    </div>
  );
};
export default TodoInput;
