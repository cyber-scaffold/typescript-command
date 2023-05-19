import path from "path";
import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

/**
 * @description 日志使用案例请参考
 * @see https://juejin.cn/post/7018169629176496158
 * **/
const customFormat = format.combine(
  format.timestamp({ format: "YYYY年MM月DD日 HH:mm:ss" }),
  format.printf((i) => `${i.level}: ${[i.timestamp]}: ${i.message}`)
);

const logs_file_path = path.resolve(process.cwd(), "./logs/");

/** 全局日志 **/
export const global_logger = createLogger({
  transports: [
    new transports.DailyRotateFile({
      level: "error",
      extension: ".log",
      filename: path.resolve(logs_file_path, "./系统日志/global_log_%DATE%"),
      datePattern: 'YYYY-MM-DD-HH',
      format: customFormat,
      maxSize: "10m",
      maxFiles: 10,
    }),
  ],
});