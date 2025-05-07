'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  dueDate: string;
  priority: string;
}

interface TaskContextProps {
  tasks: Task[];
  addTask: (title: string, category: string, dueDate: string, priority: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskCategory: (id: string, category: string) => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (title: string, category: string, dueDate: string, priority: string) => {
    setTasks((prev) => [...prev, { id: Date.now().toString(), title, completed: false, category, dueDate, priority }]);
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const updateTaskCategory = (id: string, category: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, category } : task))
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, updateTaskCategory }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTaskContext must be used within a TaskProvider');
  return context;
};
