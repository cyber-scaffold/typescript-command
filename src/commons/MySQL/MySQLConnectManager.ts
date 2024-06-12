import { injectable, inject } from "inversify";
import { createPool, Pool, PoolConnection } from "mysql2/promise";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

@injectable()
export class MySQLConnectManager {

  private pool: Pool;

  private connection: PoolConnection;

  constructor(
    @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager
  ) { };

  /** 初始化连接 **/
  public async initialize(): Promise<void> {
    const { mysql } = this.applicationConfigManager.getRuntimeConfig();
    this.pool = createPool({
      host: mysql.host,
      port: mysql.port,
      user: mysql.username,
      password: mysql.password,
      connectionLimit: 0
    });
    this.connection = await this.pool.getConnection();
    console.log("MySQL连接池初始化成功!");
  };

  /** 获取MySQL主连接 **/
  public async getPrimaryConnection() {
    try {
      await this.connection.ping();
      return this.connection;
    } catch (error) {
      await this.initialize();
    };
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