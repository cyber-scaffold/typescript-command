import { DataSource, DataSourceOptions } from "typeorm";


/** 很多分库分表都是在应用层完成的,一般都是根据数据库名进行区分 **/
export class DataSourceManager {

  private config: DataSourceOptions;

  /** DataSource对象的暂存池 **/
  private dataSourceTableList = {};

  constructor(config: DataSourceOptions) {
    this.config = config;
  };

  /** 根据数据库名称获取AppDataSource连接对象 **/
  public async getDataSourceWithDatabase(database): Promise<DataSource> {
    if (this.dataSourceTableList[database]) {
      return this.dataSourceTableList[database];
    };
    const AppDataSource = new DataSource({
      type: "mysql",
      ...this.config,
      database,
      synchronize: true
    });
    this.dataSourceTableList[database] = AppDataSource;
    return AppDataSource;
  };

};

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