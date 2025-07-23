import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "12345",
    database: process.env.DB_NAME || "medicamentos",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

// 🔹 Prueba de conexión
pool.getConnection()
    .then(conn => {
        console.log("✅ Conexión exitosa a la base de datos");
        conn.release();
    })
    .catch(err => console.error("❌ Error en la conexión:", err));

// ✅ Agregar esta función para que puedas usar getConnection()
export const getConnection = async () => {
    return await pool.getConnection();
};
