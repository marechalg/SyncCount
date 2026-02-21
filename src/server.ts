import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import path from 'path'

const PORT: number = 3001;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

let count: number = 0;

interface ClickPayload {
    userId: string,
    avater: string
}

io.on('connection', (sock: Socket) => {
    console.log(`User connected : ${sock.id}`);

    sock.emit('update', { count, lastClick: null });

    sock.on('increment', (payload: ClickPayload) => {
        count++;
        io.emit('update', { count, lastClick: payload });
    })

    sock.on('disconnect', () => {
        console.log(`User disconnected : ${sock.id}`);
    })
})

app.use(express.static(path.join(__dirname, '../public')));
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

httpServer.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})