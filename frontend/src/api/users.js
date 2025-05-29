import axios from "./axios";

export const getUsersRequest = () => axios.get("/users");
export const getUserByIdRequest = (id) => axios.get(`/users/${id}`);
export const updateVerifiedUserRequest = (id) => axios.put(`/users/${id}`);