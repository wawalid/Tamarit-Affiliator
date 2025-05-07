import { useEffect } from "react";
import { useTasks } from "../context/TasksContext";
import TaskCard from "../components/TaskCard";

function TaskPage() {
  const { getTasks, tasks } = useTasks();

  useEffect(() => {
    getTasks();
  }
    , []);

  if (tasks.length === 0) {
    return (
      <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md flex items-center justify-center">
        <h1 className="text-white">No tasks available</h1>
      </div>
    );
  }



  return (
    <div className="grid grid-cols-1 gap-1">
      {
        tasks.map(task => (
          <TaskCard task={task} key={task._id} />
        ))
      }
    </div>
  );
};

export default TaskPage;
