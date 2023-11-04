const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {

    socket.on("data", (data) => {
        const request = data.toString();
        const requestDetails = parseRequest(request);
        console.log({requestDetails});
        if (requestDetails.path.startsWith('/echo/')) {
            const echoText = requestDetails.path.substring(6);
            writeResponse(socket, 200, echoText);
        } else if (requestDetails.path === '/user-agent') {
            writeResponse(socket, 200, requestDetails['userAgent']);
        } else if (requestDetails.path === '/') {
            writeResponse(socket, 200, 'OK');
        } else {
            writeResponse(socket, 404, 'Not Found');
        }
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
    const headers = {
        method,
        path,
        httpVersion
    }

    for ( i = 1; i <= headersSplit.length-1; i++ ) {
        const [header, value] = headersSplit[i].split(': ')
        headers[`${camelCase(header)}`] = value;
    }
    return headers;
};

function writeResponse(socket, code, body) {
    socket.write(`HTTP/1.1 ${code} OK\r\n`);
    socket.write('Content-Type: text/plain\r\n');
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
