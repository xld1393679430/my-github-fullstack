import axios from "axios"

const baseUrl = 'http://localhost:3002/api/notes'

const getNotes = async () => {
    return await axios.get(baseUrl).then(res => res.data)
}

const createNote = async (note) => {
    return await axios.post(baseUrl, note).then(res => res.data)
}

const updateNote = async (id, note) => {
    return await axios.put(`${baseUrl}/${id}`, note).then(res => res.data)
}

export default {
    getNotes,
    createNote,
    updateNote,
}