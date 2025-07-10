"use client"

import { useState } from "react"
import styles from "./TodoList.module.css"

interface Comment {
  id: number
  text: string
  createdAt: Date
}

interface Todo {
  id: number
  text: string
  completed: boolean
  comments: Comment[]
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState("")
  const [commentInputs, setCommentInputs] = useState<{ [todoId: number]: string }>({})
  const [showComments, setShowComments] = useState<{ [todoId: number]: boolean }>({})

  const addTodo = () => {
    if (input.trim() !== "") {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input.trim(), 
        completed: false, 
        comments: [] 
      }])
      setInput("")
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
    // Clean up comment-related state
    setCommentInputs(prev => {
      const { [id]: removed, ...rest } = prev
      return rest
    })
    setShowComments(prev => {
      const { [id]: removed, ...rest } = prev
      return rest
    })
  }

  const addComment = (todoId: number) => {
    const commentText = commentInputs[todoId]?.trim()
    if (commentText) {
      setTodos(todos.map(todo => 
        todo.id === todoId 
          ? { 
              ...todo, 
              comments: [...todo.comments, {
                id: Date.now(),
                text: commentText,
                createdAt: new Date()
              }]
            }
          : todo
      ))
      setCommentInputs(prev => ({ ...prev, [todoId]: "" }))
    }
  }

  const deleteComment = (todoId: number, commentId: number) => {
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, comments: todo.comments.filter(comment => comment.id !== commentId) }
        : todo
    ))
  }

  const toggleComments = (todoId: number) => {
    setShowComments(prev => ({ ...prev, [todoId]: !prev[todoId] }))
  }

  const updateCommentInput = (todoId: number, value: string) => {
    setCommentInputs(prev => ({ ...prev, [todoId]: value }))
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
            <div className={styles.todoHeader}>
              <span
                onClick={() => toggleTodo(todo.id)}
                className={`${styles.todoText} ${todo.completed ? styles.completed : ""}`}
              >
                {todo.text}
              </span>
              <div className={styles.todoActions}>
                <button 
                  onClick={() => toggleComments(todo.id)} 
                  className={styles.commentButton}
                >
                  💬 ({todo.comments.length})
                </button>
                <button onClick={() => deleteTodo(todo.id)} className={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </div>
            
            {showComments[todo.id] && (
              <div className={styles.commentsSection}>
                <div className={styles.commentInput}>
                  <input
                    type="text"
                    value={commentInputs[todo.id] || ""}
                    onChange={(e) => updateCommentInput(todo.id, e.target.value)}
                    placeholder="Add a comment..."
                    className={styles.input}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addComment(todo.id)
                      }
                    }}
                  />
                  <button 
                    onClick={() => addComment(todo.id)} 
                    className={styles.addCommentButton}
                  >
                    Add
                  </button>
                </div>
                
                <div className={styles.commentsList}>
                  {todo.comments.map((comment) => (
                    <div key={comment.id} className={styles.commentItem}>
                      <div className={styles.commentContent}>
                        <span className={styles.commentText}>{comment.text}</span>
                        <span className={styles.commentDate}>
                          {comment.createdAt.toLocaleString()}
                        </span>
                      </div>
                      <button 
                        onClick={() => deleteComment(todo.id, comment.id)}
                        className={styles.deleteCommentButton}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {todo.comments.length === 0 && (
                    <p className={styles.noComments}>No comments yet</p>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
