import axios from "axios";

const API = "https://localhost:7278/api/notes";

export const getNotes = () => axios.get(API);

export const addNote = (note) => axios.post(API, note);

export const deleteNote = (id) => axios.delete(`${API}/${id}`);

export const togglePin = (id) => axios.patch(`${API}/${id}/pin`);

// ✏️ EDIT NOTE
export const updateNote = (id, updatedNote) =>
    axios.put(`${API}/${id}`, updatedNote);