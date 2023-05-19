import path from "path";
import { program } from "commander";

program.option("-c,--config <string>", "配置文件路径", "./.defaultrc.js");

export const custmer_runtime_config_path = path.join(process.cwd(), program.opts().config);
export const default_runtime_config_path = path.resolve(__dirname, "../configs/default_runtime_config.js");