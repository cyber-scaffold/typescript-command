import { injectable, inject } from "inversify";
import { createConnection, Connection } from "mongoose";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

@injectable()
export class MongooseConnectManager {

  private connection: Connection;

  constructor(
    @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager
  ) { };

  public async initialize() {
    try {
      const { mongodb } = this.applicationConfigManager.getRuntimeConfig();
      const { host, port, username, password, dataDb } = mongodb;
      const connectionURL = `mongodb://${username}:${password}@${host}:${port}/${dataDb}?authSource=admin`;
      const connection = await createConnection(connectionURL);
      this.connection = connection;
      console.log("mongoose 连接成功!!!");
    } catch (error) {
      console.log("mongoose 连接失败!!!", error);
    };
  };

  /** 销毁连接,用于单元测试 **/
  public async destroy() {
    await this.connection.destroy();
    console.log("mongoose 连接已销毁!!!");
  };

  public async getDatabaseWithName(databaseName) {
    // return this.connection;
    const database = await this.connection.useDb(databaseName);
    return database;
  };

};