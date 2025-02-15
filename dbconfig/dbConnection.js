import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
const envFile= process.env.NODE_ENV;
dotenv.config({path:`.env.${envFile}`});



// const connection= async ()=>{
//     const conn= await mysql.createConnection({
//         host:process.env.DB_HOST,
//         user:process.env.DB_USER,
//         password:process.env.DB_Pass,
//         database:process.env.DB_NAME
//     });

//     return conn;
// };

// export default connection;

//start pool for scalability 

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
});

export default pool;