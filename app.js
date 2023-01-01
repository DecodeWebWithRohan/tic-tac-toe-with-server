const fs = require('fs');
const http = require('http');

const BASE_PATH = './public';
const CONTENT_TYPE_EXTENSIONS_MAP = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/x-javascript',
};

http.createServer((req, res) => {
    const path = `${ BASE_PATH }${ req.url === '/' ? '/index.html' : req.url }`;
    const contentType = CONTENT_TYPE_EXTENSIONS_MAP[path.split('\.').pop()];

    fs.readFile(path, (error, data) => {
        if (error) {
            res.writeHead(404, { 'Content-type': 'application/json' });
            res.write(JSON.stringify({ message: 'Resource not found!' }));
            res.end();
            return;
        }

        res.writeHead(200, { 'Content-type': contentType });
        res.write(data);
        res.end();
    });
}).listen(process.env.PORT || 8080);
