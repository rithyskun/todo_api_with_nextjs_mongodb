import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'

const ENDPOINT: string = (process.env.NEXT_PUBLIC_HOSTNAME) as string

let socket: Socket

export function socketConnection() {
    fetch(ENDPOINT +'/socket')
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
