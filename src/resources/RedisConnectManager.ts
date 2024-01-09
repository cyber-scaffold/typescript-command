import { createClient, RedisClientType } from "redis";

export class RedisConnectManager {

  private host: string;

  private port: number;

  private connection: RedisClientType;

  constructor({ host, port }) {
    this.host = host;
    this.port = port;
  };

  /** 初始化Redis连接 **/
  public async initialize(): Promise<any> {
    try {
      this.connection = createClient({
        url: `redis://${this.host}:${this.port}`,
        socket: { reconnectStrategy: false }
      });

      this.connection.on("error", async (error) => {
        console.log("Redis出现错误,2s后重新连接... ...", error);
        return setTimeout(this.initialize, 2000);
      });

      await this.connection.connect();

      console.log("Redis连接成功!");
    } catch (error: any) {
      this.connection.removeAllListeners("error");
      throw error;
    };
  };

  /** 从连接池中获取一个连接 **/
  public async getConnection(): Promise<RedisClientType> {
    try {
      return this.connection;
    } catch (error) {
      throw error;
    };
  };

};


// import Redis from "ioredis";

// export let redisConnection: any;

// export async function createRedisConnection() {

//   try {
//     const client = new Redis({
//       host: "0.0.0.0",
//       port: 36379,
//       autoResendUnfulfilledCommands: false,
//       retryStrategy() {
//         return 2000;
//       }
//     });

//     client.on("connect", () => {
//       console.log("连接成功!");
//       redisConnection = client;
//     });

//   } catch (error) {
//     throw error;
//   };
// };