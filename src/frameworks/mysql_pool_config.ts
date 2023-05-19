import { createPool, Pool, PoolConnection } from "mysql2/promise";

export let mysql_pool: Pool;

export async function initial_mysql_pool() {
  mysql_pool = createPool({
    host: "0.0.0.0",
    port: 43306,
    user: "root",
    connectionLimit: 0,
    password: "glyz205070410"
  });
  console.log("连接成功!");
};

export async function get_mysql_connection(): Promise<PoolConnection> {

  try {
    return await mysql_pool.getConnection();
  } catch (error) {
    throw error;
  };

};