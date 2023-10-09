import os from "os";
import path from "path";
import { merge } from "lodash";
import pathExists from "path-exists";
import { readFileSync } from "jsonfile";

const defaultConfig = {

};

export function getGlobalConfig() {
  let global_etc_config = {};
  let global_custmer_config = {};
  const global_etc_config_path = path.join("/etc/", "/application/", "./config.json");
  if (pathExists.sync(global_etc_config_path)) {
    global_etc_config = readFileSync(global_etc_config_path);
  };
  const global_custmer_config_path = path.join(os.homedir(), "/.application/", "./config.json");
  if (pathExists.sync(global_custmer_config_path)) {
    global_custmer_config = readFileSync(global_custmer_config_path);
  };
  const compose_config = merge(defaultConfig, global_etc_config, global_custmer_config);
  return compose_config;
};