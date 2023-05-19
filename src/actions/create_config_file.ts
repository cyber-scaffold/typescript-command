import fs from "fs";
import consola from "consola";
import { green } from "colors";
import { promisify } from "util";
import pathExists from "path-exists";
import { default_runtime_config_path, custmer_runtime_config_path } from "@/configs/commons";

export async function create_config_file() {
  if (await pathExists(custmer_runtime_config_path)) {
    return consola.info(green(custmer_runtime_config_path), "已经存在!");
  } else {
    await promisify(fs.copyFile)(default_runtime_config_path, custmer_runtime_config_path);
    return consola.success(green(custmer_runtime_config_path), "创建完成!");
  }
};