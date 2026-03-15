const PROT = 'https';
const HOST = window.location.hostname;

const sock = io(`${PROT}://${HOST}`);
const count = document.getElementById('count');

sock.on('update', data => {
    count.textContent = String(data.count);
})

document.getElementsByTagName('main')[0].addEventListener('click', () => {
    sock.emit('increment');
})