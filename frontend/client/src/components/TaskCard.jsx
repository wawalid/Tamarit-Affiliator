import { useTasks } from "../context/TasksContext";
import { Link } from "react-router-dom";

function TaskCard({ task }) {
  const { deleteTask } = useTasks();

  return (
    <div className="bg-zinc-800 max-w-md w-full p-12 rounded-md flex flex-col items-center justify-center m-2">
      <header className="flex justify-between w-full mb-4">
        <h1 className="text-2xl font-bold">{task.title}</h1>
        <div className="flex gap-2 items-center">
          <button onClick={() => deleteTask(task._id)}>Delete</button>
          <Link to={`/tasks/${task._id}`} className="text-blue-500">
            Edit
          </Link>
        </div>
      </header>
      <p className="text-slate-300">{task.description}</p>
      <p>{new Date(task.date).toLocaleDateString()}</p>
    </div>
  );
}

export default TaskCard;
