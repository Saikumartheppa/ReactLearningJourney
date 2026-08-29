import { useState } from "react";
import { TodoInput, TodoList } from "../todo";
import styles from "./style.module.scss";
const Todo = () => {
  const [todoInputField, setTodoInputField] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const handleInputField = (value) => {
    setTodoInputField(value);
  };
  const handleAddTodoItem = (value) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }
    const todoItem = {
      id: todoList.length + 1,
      title: trimmedValue,
      isCompleted: false,
    };
    setTodoList((prev) => [...prev, todoItem]);
    setTodoInputField("");
  };
  const handleCheckboxClick = (toBeCompletedTodoId) => {
    const updatedList = todoList.map((todo) => {
      if (todo.id === toBeCompletedTodoId) {
        todo.isCompleted = !todo.isCompleted;
      }
      return todo;
    });
    setTodoList(updatedList);
  };
  const handleDeleteTodo = (toBeDeletedTodoId) => {
    const updatedTodoList = todoList.filter(
      (todo) => todo.id !== toBeDeletedTodoId,
    );
    setTodoList(updatedTodoList);
  };
  const handleEditTodo = (toBeEditedTodoId) => {
    setEditingTodoId(toBeEditedTodoId);
  };
  const handleCancelTodo = () => {
    setEditingTodoId(null);
  };
  const handleSaveTodo = (toBeSavedTodoId , EditedValue) => {
    const trimmedValue = EditedValue.trim();
    if(!trimmedValue){
      return;
    }
    const updatedTodoList = todoList.map((todo) => 
      todo.id === toBeSavedTodoId ? {...todo , title : trimmedValue} : todo)
    setTodoList(updatedTodoList);
    setEditingTodoId(null);
  }
  return (
    <div className={styles["todo"]}>
      <h1>Todo App</h1>
      <TodoInput
        todoInputField={todoInputField}
        handleInputField={handleInputField}
        handleAddTodoItem={handleAddTodoItem}
      />
      <TodoList
        todoList={todoList}
        handleCheckboxClick={handleCheckboxClick}
        handleDeleteTodo={handleDeleteTodo}
        editingTodoId={editingTodoId}
        handleEditTodo={handleEditTodo}
        handleCancelTodo={handleCancelTodo}
        handleSaveTodo={handleSaveTodo}
      />
    </div>
  );
};
export default Todo;
