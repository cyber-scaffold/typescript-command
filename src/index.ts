#!/usr/bin/env node
import { green } from "colors";
import { program } from "commander";

import { IOCContainer } from "@/commons/Application/IOCContainer";
import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";

import { definition as definitionTestProjectCommand } from "@/controllers/TestProject";

import { name, version } from "../package.json";

setImmediate(async () => {
  try {
    program.name(green(name)).usage(["", green(`${name} command <argument> [options]`)].join("\n")).version(version);
    const testCommand = program.command("test").description("这是test相关的命令,是根节点");
    await definitionTestProjectCommand(testCommand);
    program.parse();
    await IOCContainer.get(ApplicationConfigManager).initialize();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
