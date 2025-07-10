"use client"

import { useState } from "react"
import styles from "./TodoList.module.css"

interface Comment {
  id: number
  text: string
  timestamp: Date
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
  const [commentInputs, setCommentInputs] = useState<{[todoId: number]: string}>({})
  const [showComments, setShowComments] = useState<{[todoId: number]: boolean}>({})

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
    // 관련된 댓글 입력창과 표시 상태도 정리
    const newCommentInputs = { ...commentInputs }
    const newShowComments = { ...showComments }
    delete newCommentInputs[id]
    delete newShowComments[id]
    setCommentInputs(newCommentInputs)
    setShowComments(newShowComments)
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
                timestamp: new Date()
              }]
            }
          : todo
      ))
      setCommentInputs({ ...commentInputs, [todoId]: "" })
    }
  }

  const deleteComment = (todoId: number, commentId: number) => {
    setTodos(todos.map(todo =>
      todo.id === todoId
        ? {
            ...todo,
            comments: todo.comments.filter(comment => comment.id !== commentId)
          }
        : todo
    ))
  }

  const toggleComments = (todoId: number) => {
    setShowComments({ ...showComments, [todoId]: !showComments[todoId] })
  }

  const handleCommentInputChange = (todoId: number, value: string) => {
    setCommentInputs({ ...commentInputs, [todoId]: value })
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Todo List</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, addTodo)}
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
            <div className={styles.todoContent}>
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
                  💬 Comments ({todo.comments.length})
                </button>
                <button onClick={() => deleteTodo(todo.id)} className={styles.deleteButton}>
                  Delete
                </button>
              </div>
            </div>
            
            {showComments[todo.id] && (
              <div className={styles.commentsSection}>
                <div className={styles.commentInputContainer}>
                  <input
                    type="text"
                    value={commentInputs[todo.id] || ""}
                    onChange={(e) => handleCommentInputChange(todo.id, e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, () => addComment(todo.id))}
                    className={styles.commentInput}
                    placeholder="Add a comment..."
                  />
                  <button 
                    onClick={() => addComment(todo.id)} 
                    className={styles.addCommentButton}
                  >
                    Add Comment
                  </button>
                </div>
                
                <div className={styles.commentsList}>
                  {todo.comments.map((comment) => (
                    <div key={comment.id} className={styles.comment}>
                      <div className={styles.commentText}>{comment.text}</div>
                      <div className={styles.commentMeta}>
                        <span className={styles.commentTime}>
                          {comment.timestamp.toLocaleString()}
                        </span>
                        <button 
                          onClick={() => deleteComment(todo.id, comment.id)}
                          className={styles.deleteCommentButton}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  {todo.comments.length === 0 && (
                    <div className={styles.noComments}>No comments yet</div>
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
