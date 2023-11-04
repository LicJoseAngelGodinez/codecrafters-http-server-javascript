const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {

    socket.on("data", (data) => {
        const dataString = data.toString();
        const [method, path, httpVersion, userAgent] = dataString.split(" ");
        if (path === "/") {
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
            socket.end();
            return;
        } else if (method === "GET" && path.startsWith('/echo/')) {
            const randomString = path.substring(6);
            socket.write("HTTP/1.1 200 OK\r\n");
            socket.write("Content-Type: text/plain\r\n");
            socket.write(`Content-Length: ${randomString.length}\r\n\r\n`);
            socket.write(randomString);
            console.log("Status 200 OK");
            socket.end();
            return;
        } else if (method === "GET") {
            const userAgentData = userAgent.slice(0, userAgent.length-9);
            socket.write("HTTP/1.1 200 OK\r\n");
            socket.write("Content-Type: text/plain\r\n");
            socket.write(`Content-Length: ${userAgentData.length}\r\n\r\n`);
            socket.write(userAgentData);
            console.log("Status 200 OK");
            socket.end();
            return;
        } else {
            socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
            socket.end();
            return;
        }
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});
//
server.listen(4221, "localhost");
