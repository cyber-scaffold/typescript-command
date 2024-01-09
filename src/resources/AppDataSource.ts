import { DataSource } from "typeorm";


import { getGlobalConfig } from "@/resources/getGlobalConfig";

const globalConfig = getGlobalConfig();

export const AppDataSource = new DataSource({
  type: "mysql",
  ...globalConfig.mysql,
  database: "",
  synchronize: true,
  entities: [],
  subscribers: [],
  migrations: [],
});