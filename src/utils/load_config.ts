import deep from "deep-extend";
import exists from "path-exists";
import { default_runtime_config_path, custmer_runtime_config_path } from "@/configs/commons";

export default async function load_config() {
  let default_runtime_config, custmer_runtime_config;
  if (await exists(default_runtime_config_path)) {
    default_runtime_config = require(default_runtime_config_path);
  };
  if (await exists(custmer_runtime_config_path)) {
    custmer_runtime_config = require(custmer_runtime_config_path);
  };
  return deep({}, default_runtime_config, custmer_runtime_config);
};