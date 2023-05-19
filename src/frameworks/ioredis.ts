import Redis from "ioredis";

export let redis_connection: any;

export async function createRedisConnection() {

  try {
    const client = new Redis({
      host: "0.0.0.0",
      port: 36379,
      autoResendUnfulfilledCommands: false,
      retryStrategy() {
        return 2000;
      }
    });

    client.on("connect", () => {
      console.log("连接成功!");
      redis_connection = client;
    });

  } catch (error) {
    throw error;
  };
};