// import {Argument,Option} from "commander";
import load_config from "@/utils/load_config";

// export const test_command_argument=new Argument("<actions>","动作类型描述").choices(["init","info"]);
// export const test_command_option=new Option("-t,--test_option <string>").default("test_option_value");

export async function test_command() {
  console.log(await load_config());
}