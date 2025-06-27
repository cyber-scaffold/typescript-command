import { DataSource } from "typeorm";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@/commons/Application/IOCContainer";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";
import { logger } from "@/utils/logger";

/** 很多分库分表都是在应用层完成的,一般都是根据数据库名进行区分 **/
@injectable()
export class DataSourceManager {

  /** DataSource对象的暂存池 **/
  private appDataSource: DataSource;

  constructor(
    @inject(ApplicationConfigManager) private readonly $ApplicationConfigManager: ApplicationConfigManager
  ) { };

  /** 初始化 **/
  public async initialize() {
    const { mysql } = this.$ApplicationConfigManager.getRuntimeConfig();
    this.appDataSource = new DataSource({
      type: "mysql",
      port: mysql.port,
      host: mysql.host,
      username: mysql.username,
      password: mysql.password,
      database: mysql.database,
      entities: [],
      synchronize: true
    });
    await this.appDataSource.initialize();
    logger.info("AppDataSource 连接成功!");
  };

  /** 根据数据库名称获取AppDataSource连接对象 **/
  public async getDataSource(): Promise<DataSource> {
    try {
      return this.appDataSource;
    } catch (error) {
      await this.initialize();
    };
  };

};

IOCContainer.bind(DataSourceManager).toSelf().inSingletonScope();

/**
 * @description 配置样例如下
 * **/
// export const dataSourceManager=new DataSourceManager({
//   type: "mysql",
//   host: "0.0.0.0",
//   port: 3306,
//   username: "root",
//   entities: [],
//   subscribers: [],
//   migrations: [],
// });