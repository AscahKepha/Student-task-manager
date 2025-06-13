import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';

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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });


  const initialTodos: Todo[] = [
    { id: '1', text: 'Complete online JavaScript course', completed: true },
    { id: '2', text: 'Jog around the park 3x', completed: false },
    { id: '3', text: '10 minutes meditation', completed: false },
    { id: '4', text: 'Read for 1 hour', completed: false },
    { id: '5', text: 'Pick up groceries', completed: false },
    { id: '6', text: 'Complete Todo App on Frontend Mentor', completed: false },
  ];

  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
  
    return savedTodos ? JSON.parse(savedTodos) : initialTodos;
  });

  const [filter, setFilter] = useState<TodoFilter>('all');

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

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

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className={`app-container ${theme}`}>
      <header className="header">
        <h1>TODO</h1>
        <button onClick={toggleTheme} className="theme-toggle-button" aria-label={`Toggle to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>
      <div className="content-wrapper">
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

          <div className="list-footer">
            <span className="items-left-count">{activeTodosCount} items left</span>
            <button onClick={clearCompleted} className="clear-completed-button">
              Clear Completed
            </button>
          </div>
        </div>

        <div className="filter-card">
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
        <p className="drag-info-text">Drag and drop to reorder list (Functionality not implemented)</p>
      </div>
    </div>
  );
};

export default App;