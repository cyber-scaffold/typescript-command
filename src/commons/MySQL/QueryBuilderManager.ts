import knex, { Knex } from "knex";
import { injectable, inject } from "inversify";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

@injectable()
export class QueryBuilderManager {

  private _knexQueryBuilder: Knex;

  constructor(
    @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager
  ) { };

  /** 初始化knex**/
  public async initialize() {
    const { mysql } = this.applicationConfigManager.getRuntimeConfig();
    this._knexQueryBuilder = knex({
      client: "mysql2",
      connection: {
        host: mysql.host,
        port: mysql.port,
        user: mysql.username,
        password: mysql.password
      }
    });
    console.log("knex数据访问层初始化成功!");
  };

  /** 根据数据库名称获取knex的QueryBuilder **/
  public async getQueryBuilder(): Promise<Knex> {
    return this._knexQueryBuilder;
  };

};