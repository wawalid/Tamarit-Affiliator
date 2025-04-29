import { useAuth } from "../context/AuthContext";

function TaskPage() {

  const {user} = useAuth()
  console.log(user)



  return (
    <div>
      <h1>Task Page</h1>
      <p>This is the task page.</p>
    </div>
  );
}

export default TaskPage;