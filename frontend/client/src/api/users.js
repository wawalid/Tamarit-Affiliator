import axios from "./axios";

export const getUsersRequest = () => axios.get("/users");
