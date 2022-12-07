import { useEffect, useState } from 'react'
import io from 'socket.io-client'

import type { ChangeEvent } from 'react'
import type { Socket } from 'socket.io-client'

let socket: undefined | Socket

export default function Client() {
  const [input, setInput] = useState('')
  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async () => {
    fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log('connected')
    })

    socket.on('update-input', (msg) => {
      setInput(msg)
    })
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)

    if (socket !== undefined) {
      socket.emit('input-change', e.target.value)
    }
  }

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  )
}