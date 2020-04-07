import { createConnection, Connection } from 'typeorm';
import { File } from "../../../entity/file"


let connection : Promise<Connection>= new Promise((res,rej)=>{
    createConnection({
    type: "mysql",
    host: "192.168.0.14",
    username: "kuldeep.chopra",
    password: "Welcome@1",
    database: "gatekeeper",
    entities: [File]
  }).then(async (connection: Connection) => {
    await connection.synchronize();
    res(connection);
 }).catch(error => {
     rej(error)
  });
})

export default connection;