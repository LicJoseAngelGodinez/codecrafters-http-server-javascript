const net = require("net");
const fs = require("fs");
const pathModule = require("path");

const server = net.createServer();
const args = process.argv.slice(2);
const directory = args[0] === '--directory' ? args[1] : __dirname;

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
server.on('connection', (socket) => {
    socket.on("data", (data) => {

        const request = data.toString();

        const { method, path, headers } = parseRequest(request);

        let code = 200;
        let body = 'OK';
        let contentType = 'text/plain';

        if (path.startsWith('/echo/')) {
            body = path.substring(6);
        } else if (path === '/user-agent') {
            body = headers['userAgent'];
        } else if (method === 'POST' && path.startsWith('/files/')) {

            const filePath = pathModule.join(directory, path.substring(7));

            try {
                const fileContent = request.split('\r\n\r\n')[1];
                fs.writeFileSync(filePath, fileContent);
                code = 201;
                body = 'Created';
            } catch (error) {
                code = 500;
                body = 'Internal Server Error';
            }

        } else if ( path !== '/') {            
            code = 404;
            body = 'Not Found';
        }
        writeResponse(socket, code, contentType, body);
        socket.end();
        socket.end();
  });

  socket.on("close", () => {
    socket.end();
    socket.end();
    server.close();
  });
  socket.on("error", () => {
    socket.destroy();
    socket.destroy();
    server.close();
  });
});
//
server.listen({
    host: "localhost",
    port: 4221,
}, () => {
    console.log('opened server on', server.address());
});

function parseRequest (request) {
    const splitRemoveSpaces = request.split(/(\r\n|\n|\r)/gm).filter(line => line !== '' );
    const headersSplit = splitRemoveSpaces.map(header => header.replace("\r\n", '')).filter(element => element !== '');
    const [ method, path, httpVersion ] = headersSplit[0].split(' ');
    const headers = {}

    for ( i = 1; i <= headersSplit.length-1; i++ ) {
        const [header, value] = headersSplit[i].split(': ')
        headers[`${camelCase(header)}`] = value;
    }
    return {
        method,
        path,
        httpVersion,
        headers,
    };
};

function writeResponse(socket, code, contentType, body) {
    socket.write(`HTTP/1.1 ${code} OK\r\n`);
    socket.write(`Content-Type: ${contentType}\r\n`);
    socket.write(`Content-Length: ${body.length}\r\n\r\n`);
    socket.write(body);

}

// camelCase function credit to @apsillers 
// https://stackoverflow.com/questions/10425287/convert-dash-separated-string-to-camelcase
function camelCase(input) { 
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}
