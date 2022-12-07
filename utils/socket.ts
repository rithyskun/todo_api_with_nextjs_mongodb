import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

const NEXT_PUBLIC_HOSTNAME: string = (process.env.NEXT_PUBLIC_HOSTNAME) as string

let socket: Socket

export function socketConnection() {
    fetch('/api/socket')
    socket = io();
}

export function socketDisconnected() {
    if(socket) {
        socket.disconnect()
    }
}

export function socketEmit(event: string, payload: any) {
    socket.emit(event, payload)
}

export function socketOn(event: string, payload: any) {
    socket.on(event, payload)
}
