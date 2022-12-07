import type { Server as HTTPServer } from 'http'
import type { Socket as NetSocket } from 'net'
import { Server as IOServer } from 'socket.io'
import type { NextApiRequest, NextApiResponse } from "next";

interface SocketServer extends HTTPServer {
    io?: undefined | IOServer
}

interface SocketWithIO extends NetSocket {
    server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
    socket: SocketWithIO
}

export default function SocketHanler(
    _: NextApiRequest,
    res: NextApiResponseWithSocket
) {
    if (res.socket.server.io) {
        console.log('Socket is already running.')
    } else {
        console.log('Socket is initializing...')

        const io = new IOServer(res.socket.server, { cors: { origin: '*' } })
        res.socket.server.io = io

        io.on('connection', (socket) => {
            socket.on('updateTodo', (payload) => {
                setTimeout(() => {
                    socket.broadcast.emit('fetchTodo', payload)
                }, 1000)
            })

            socket.on('disconnect', () => {
                socket.broadcast.emit('disconnected')
            })
        })
    }
    res.end()
}