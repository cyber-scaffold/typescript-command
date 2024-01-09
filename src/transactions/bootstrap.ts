import { MySQLConnectManager } from "@/resources/MySQLConnectManager";
import { RedisConnectManager } from "@/resources/RedisConnectManager";
import { ApplicationConfigManager } from "@/resources/ApplicationConfigManager";

export const redisConnectManager = new RedisConnectManager();
export const mysqlConnectManager = new MySQLConnectManager();
export const applicationConfigManager = new ApplicationConfigManager();

export async function bootstrap() {
  await applicationConfigManager.initialize();
  const runtimeConfig = applicationConfigManager.getRuntimeConfig();
  await redisConnectManager.initialize(runtimeConfig.redis);
  await mysqlConnectManager.initialize(runtimeConfig.mysql);
};