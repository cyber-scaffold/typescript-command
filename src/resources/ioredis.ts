import Redis from "ioredis";

export let redisConnection: any;

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
      redisConnection = client;
    });

  } catch (error) {
    throw error;
  };
};