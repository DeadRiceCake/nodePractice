const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node</h1>');
    res.end('<p>Hello server</p>');
});
server.listen(8081);

server.on('listening', ()=>{ // 서버 연결
    console.log('8081번 포트 서버 대기중...');
});
server.on('error', (error)=>{
    console.error(error);
});