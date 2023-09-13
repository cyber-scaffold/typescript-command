import { createPool, Pool, PoolConnection } from "mysql2/promise";

export let mysqlPool: Pool;

export async function initialMySQLPool() {
  mysqlPool = createPool({
    host: "0.0.0.0",
    port: 43306,
    user: "root",
    connectionLimit: 0,
    password: ""
  });
  console.log("连接成功!");
};

export async function getMySQLConnection(): Promise<PoolConnection> {

  try {
    return await mysqlPool.getConnection();
  } catch (error) {
    throw error;
  };

};