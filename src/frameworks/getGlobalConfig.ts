import os from "os";
import path from "path";
import isDocker from "is-docker";
import { readFileSync } from "jsonfile";

export function getGlobalConfig() {

  let global_config_path;

  if (isDocker()) {

    global_config_path = path.join("/etc/", "/application/", "./runtime_config.json")

  } else {

    global_config_path = path.resolve(os.homedir(), "./runtime_config.json")

  };

  const global_config = readFileSync(global_config_path);
  return global_config;
};