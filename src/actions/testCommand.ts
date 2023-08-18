// import {Argument,Option} from "commander";
import { loadRumtimeConfigFile } from "@/utils/loadRumtimeConfigFile";

// export const test_command_argument=new Argument("<actions>","动作类型描述").choices(["init","info"]);
// export const test_command_option=new Option("-t,--test_option <string>").default("test_option_value");

export async function testCommand() {
  console.log(await loadRumtimeConfigFile());
}