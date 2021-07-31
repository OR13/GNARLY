const { server } = require('./dist');
const port = 8080;

console.log(`serving server on port ${port}`);

server.listen(port, '0.0.0.0', (err, address) => {
  if (err) {
    console.error(err);
  }
  server.log.info(`server listening on ${address}`);
});
