import ClickPayload from '../src/ClickPayload';

const PROT = 'http';
const HOST = '10.241.71.34';
const PORT = 3001;

const sock = io(`${PROT}://${HOST}:${PORT}`);
const count = document.getElementById('count');

sock.on('update', data => {
    count.textContent = String(data.count);
})

document.getElementsByTagName('main')[0].addEventListener('click', () => {
    sock.emit('increment');
})