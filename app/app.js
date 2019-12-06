const Server = require('./lib/server');
const Database = require('./lib/mongo');

let server = new Server();
let db = new Database();

db.getDB('mongodb://localhost:27017/sportmaster')
    .then(() => console.log("mongo connected"))

server.start(3000)
    .then(() => {
    
    })
    .catch((err) => console.log(err))
