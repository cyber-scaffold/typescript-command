import { createPool, Pool, PoolConnection } from "mysql2/promise";

export class MySQLConnectManager {

  private host: string;

  private port: number;

  private user: string;

  private password: string;

  private pool: Pool;

  /** 初始化连接 **/
  public async initialize({ host, port, user, password }): Promise<void> {
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.pool = createPool({
      host: this.host,
      port: this.port,
      user: this.user,
      password: this.password,
      connectionLimit: 0
    });
    console.log("MySQL连接池初始化成功!");
  };

  /** 从连接池中获取一个连接 **/
  public async getConnectionByPool(): Promise<PoolConnection> {
    try {
      const connection = await this.pool.getConnection();
      return connection;
    } catch (error) {
      throw error;
    };
  };

};