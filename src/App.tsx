import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './App.css'; // Import the main CSS file

// Inferring types directly in App.tsx
interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

type TodoFilter = 'all' | 'active' | 'completed';

interface TodoFormInput {
  todoText: string;
}

const App: React.FC = () => {
  // --- Global State Management ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [filter, setFilter] = useState<TodoFilter>('all');

  // --- Effects for Theme and Persistence ---
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // --- Handlers for Theme, Todos, and Filter ---
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
    };
    setTodos(prevTodos => [...prevTodos, newTodo]);
  };

  const toggleComplete = (id: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  const handleSetFilter = (newFilter: TodoFilter) => {
    setFilter(newFilter);
  };

  const { register, handleSubmit, reset } = useForm<TodoFormInput>();

  const onSubmitNewTodo = (data: TodoFormInput) => {
    if (data.todoText.trim()) {
      addTodo(data.todoText.trim());
      reset(); 
    }
  };

  //Filtered Todos List
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; 
  });

  return (
    <div className={`app-container ${theme}`}>
      <div className="content-wrapper">
        <header className="header">
          <h1>TODO</h1>
          <button onClick={toggleTheme} className="theme-toggle-button" aria-label={`Toggle to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? '☀️' : '🌙'} {/* Simple text icons */}
          </button>
        </header>

        {/* Todo Input Form */}
        <form onSubmit={handleSubmit(onSubmitNewTodo)} className="todo-input-form">
          <div className="checkbox-placeholder"></div>
          <input
            type="text"
            placeholder="Create a new todo..."
            {...register("todoText", { required: true })}
            className="todo-input-field"
            aria-label="Create new todo"
          />
        </form>

        {/* Todo List and Footer */}
        <div className="todo-list-card">
          <ul className="todo-items-list">
            {filteredTodos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <button
                  onClick={() => toggleComplete(todo.id)}
                  className="todo-checkbox"
                  aria-label={todo.completed ? `Mark "${todo.text}" as incomplete` : `Mark "${todo.text}" as complete`}
                >
                  {todo.completed && (
                    // Simple checkmark SVG
                    <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </button>
                <span className="todo-item-text">{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-todo-button"
                  aria-label={`Delete todo: ${todo.text}`}
                >
                  &#x2715; 
                </button>
              </li>
            ))}
          </ul>

          {/* List Footer / Filter Bar */}
          <div className="list-footer">
            <span className="items-left-count">{activeTodosCount} items left</span>
            <div className="filter-buttons-group">
              <button
                onClick={() => handleSetFilter('all')}
                className={`filter-button ${filter === 'all' ? 'active-filter' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => handleSetFilter('active')}
                className={`filter-button ${filter === 'active' ? 'active-filter' : ''}`}
              >
                Active
              </button>
              <button
                onClick={() => handleSetFilter('completed')}
                className={`filter-button ${filter === 'completed' ? 'active-filter' : ''}`}
              >
                Completed
              </button>
            </div>
            <button onClick={clearCompleted} className="clear-completed-button">
              Clear Completed
            </button>
          </div>
          <p className="drag-info-text">Drag and drop to reorder list (Functionality not implemented)</p>
        </div>
      </div>
    </div>
  );
};

export default App;