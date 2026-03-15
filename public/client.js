const PROT = 'http';
const HOST = process.env.HOST;
const PORT = 3000;

const sock = io(`${PROT}://${HOST}:${PORT}`);
const count = document.getElementById('count');

sock.on('update', data => {
    count.textContent = String(data.count);
})

document.getElementsByTagName('main')[0].addEventListener('click', () => {
    sock.emit('increment');
})