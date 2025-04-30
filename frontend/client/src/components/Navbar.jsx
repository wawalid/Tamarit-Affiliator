import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutRequest } from "../api/auth";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <nav className="bg-zinc-800 my-3 flex justify-between py-5 px-10 rounded-lg">
      <Link to={"/"}>
        <h1 className="text-2xl font-bold">task manager</h1>
      </Link>
      <ul className="flex gap-x-5 text-white">
        {isAuthenticated ? (
          <>
            <li>Welcome {user.username}</li>
            <li>
              <Link to={"/add-task"}>Add task</Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={() => {
                  logout();
                  const res = logoutRequest();
                  console.log(res);
                }}
              >
                Log out
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to={"/login"}>Login</Link>
            </li>
            <li>
              <Link to={"/register"}>Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
