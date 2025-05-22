import axios from "./axios";

export const getUsersRequest = () => axios.get("/users");
export const updateVerifiedUserRequest = (id) => axios.put(`/users/${id}`);