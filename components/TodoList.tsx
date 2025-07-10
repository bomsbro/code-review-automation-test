"use client"

import { useState } from "react"
import styles from "./TodoList.module.css"

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState("")

  const addTodo = () => {
    if (input.trim() !== "") {
      setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }])
      setInput("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Todo List</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.input}
          placeholder="Add a new todo"
        />
        <button onClick={addTodo} className={styles.addButton}>
          Add
        </button>
      </div>
      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <li key={todo.id} className={styles.todoItem}>
            <span
              onClick={() => toggleTodo(todo.id)}
              className={`${styles.todoText} ${todo.completed ? styles.completed : ""}`}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)} className={styles.deleteButton}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
