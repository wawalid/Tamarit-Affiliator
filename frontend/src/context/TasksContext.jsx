import { createContext, useContext, useState } from "react";
import {
  getTaskRequest,
  getTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
} from "../api/tasks";

const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    try {
      const res = await getTasksRequest();
      setTasks(res.data);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving tasks" });
    }
  };

  const getTask = async (id) => {
    try {
      const res = await getTaskRequest(id);
      return res.data;
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving task" });
    }
  };

  const createTask = async (task) => {
    try {
      const res = await createTaskRequest(task);
      console.log(res.data);
    } catch (error) {
      return res.status(500).json({ message: "Error creating task" });
    }
  };

  const updateTask = async (id, task) => {
    try {
      await updateTaskRequest(id, task);
    } catch (error) {
      return res.status(500).json({ message: "Error updating task" });
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await deleteTaskRequest(id);
      if (res.status == 204) {
        setTasks(tasks.filter((task) => task._id !== id));
        console.log("Task deleted successfully");
      }
    } catch (error) {
      return res.status(500).json({ message: "Error deleting task" });
    }
  };

  return (
    <TaskContext.Provider
      value={{ tasks, getTasks, getTask, createTask, deleteTask, updateTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}
export default TaskContext;
