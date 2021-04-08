import { message } from 'antd'
import axios from 'axios'
import React, { useState, useEffect, } from 'react'
import noteServer from '../../services/notes'
import './index.css'

const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
  
    return (
      <div className="error">
        {message}
      </div>
    )
  }

const Note = ({ note: { content, important }, toggleImportant }) => {
    return (
        <li className="note">
            {content}
            <button onClick={toggleImportant} style={{ marginLeft: 10 }}>
                {important ? 'make no important' : 'make important'}
            </button>
        </li>
    )
}

const Page = () => {
    const messageKey = 'messageKey'
    const [notes, setNotes] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [showAll, setShowAll] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const notesToShow = showAll ? notes : notes.filter(item => item.important)

    const handleSubmit = async (event) => {
        event.preventDefault()
        message.loading({ content: '添加中...', key: messageKey })
        console.log(event.target, 'event')
        const note = {
            content: inputValue,
            date: new Date().toISOString(),
            important: Math.random() < 0.5,
            id: notes.length + 1
        }
        try {
            await noteServer.createNote(note)
            message.success({ content: '添加成功', key: messageKey })
            setNotes(notes.concat(note))
            setInputValue('')
        } catch (error) {
            message.error({ content: '添加失败', key: messageKey })
        }


    }

    const handleChangeInputValue = (event) => {
        setInputValue(event.target.value)
    }

    const handleToggleShowAll = () => {
        setShowAll(!showAll)
    }

    const handleToggleImportant = async (id) => {
        const note = notes.find(item => item.id === id)
        const changedNote = { ...note, important: !note.important }
        const data = await noteServer.updateNote(id, changedNote)
        setNotes(notes.map(item => item.id === id ? data : item))
    }

    useEffect(() => {
        noteServer.getNotes().then(data => setNotes(data))
    }, [])

    return (
        <div>
            <h1>notes</h1>  
            <Notification message={errorMessage} />
            <button onClick={handleToggleShowAll}>show {showAll ? 'important' : 'all'}</button>
            <ul>
                {
                    notesToShow.map((item, index) => (
                        <Note key={index}
                            note={item}
                            toggleImportant={() => handleToggleImportant(item.id)} />
                    ))
                }
            </ul>
            <form onSubmit={handleSubmit}>
                <input placeholder='请输入'
                    value={inputValue}
                    onChange={handleChangeInputValue}
                />
                <button type={'submit'} >提交</button>
            </form>
        </div>
    )
}

export default Page