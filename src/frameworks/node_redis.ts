import { createClient, RedisClientType } from "redis";

export let connection: RedisClientType;

export async function createRedisConnection(): Promise<any> {
  try {
    connection = createClient({
      url: `redis://0.0.0.0:36379`,
      socket: {
        reconnectStrategy: false
      }
    });

    connection.on("error", async (error) => {
      console.log("Redis出现错误,2s后重新连接... ...", error);
      return setTimeout(createRedisConnection, 2000);
    });

    await connection.connect();

    console.log("Redis连接成功!");
  } catch (error: any) {
    connection.removeAllListeners("error");
    throw error;
  };
};