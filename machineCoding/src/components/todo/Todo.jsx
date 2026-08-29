import { useState } from "react";
import {TodoInput, TodoList} from "../todo";
import styles from "./style.module.scss";
const Todo = () => {
  const [todoInputField, setTodoInputField] = useState("");
  const [todoList, setTodoList] = useState([]);
  const handleInputField = (value) => {
    const trimmedValue = value.trim();
    setTodoInputField(trimmedValue);
  };
  const handleAddTodoItem = (value) => {
    const todoItem = {
      id: todoList.length + 1,
      title: value.trim(),
      isCompleted: false,
    };
    setTodoList((prev) => [...prev, todoItem]);
    setTodoInputField('');
  };
  const handleCheckboxClick = (id) => {
     const updatedList = todoList.map((todo) => {
        if(todo.id === id){
           todo.isCompleted = !todo.isCompleted
        }
        return todo;
     })
     setTodoList(updatedList);
  }
  return (
    <div className={styles["todo"]}>
      <h1>Todo App</h1>
      <TodoInput
        todoInputField={todoInputField}
        handleInputField={handleInputField}
        handleAddTodoItem={handleAddTodoItem}
      />
      <TodoList todoList={todoList} handleCheckboxClick={handleCheckboxClick}/>
    </div>
  );
};
export default Todo;
