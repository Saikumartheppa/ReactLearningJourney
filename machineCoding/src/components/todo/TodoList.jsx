import styles from "./style.module.scss";
const TodoItem = ({todoItem , handleCheckboxClick}) => {
  const {id , title , isCompleted} = todoItem;
  return (
    <div className={styles['todo__todoItem']}>
      <input type="checkBox" checked={isCompleted} className={styles['todo__checkBox']} onChange={() => handleCheckboxClick(id)}/>
      <p className={`${isCompleted ?  styles['todo--title-completed'] : ""}`}>{title}</p>
      <button className={styles['todo--deleteBtn']} >Delete</button>
    </div>
  );
};
const TodoList = (props) => {
  const {todoList , handleCheckboxClick} = props;
  return (
    <div className={styles['todo__todoList']}>
        {todoList.map((todoItem) => {
            return <TodoItem key={todoItem.id} todoItem ={todoItem} handleCheckboxClick={handleCheckboxClick}/>
        })}
    </div>
  );
};
export default TodoList;
