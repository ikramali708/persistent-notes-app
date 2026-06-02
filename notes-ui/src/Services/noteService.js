import axios from "axios";

const API = "https://localhost:7278/api/notes";
// 👆 apna backend port check karna

export const getNotes = () => axios.get(API);
export const addNote = (note) => axios.post(API, note);

export const deleteNote = (id) => axios.delete(`${API}/${id}`);

export const togglePin = (id) => axios.patch(`${API}/${id}/pin`);