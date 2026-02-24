import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { readFileSync, writeFileSync } from 'fs';
import ClickPayload from './ClickPayload';

const PORT: number = 3001;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

let count: number = 0;
try {
    count = JSON.parse(readFileSync('data/count.json', 'utf-8')).count;
} catch (err) {
    if (err instanceof Error) console.error(`Error reading count.json : ${err.stack}`);
}

io.on('connection', (sock: Socket) => {
    sock.emit('update', { count, lastClick: null });

    sock.on('increment', (payload: ClickPayload) => {
        count++;
        io.emit('update', { count, lastClick: payload });
        
        setImmediate(() => {
            writeFileSync('data/count.json', JSON.stringify({ count }))
        })
    })

    sock.on('disconnect', () => {})
})

app.use(express.static('public'));
app.get('/', (req: Request, res: Response) => {
    res.sendFile('public/index.html');
})

httpServer.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})