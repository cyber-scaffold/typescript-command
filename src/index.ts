#!/usr/bin/env node
import { green } from "colors";
import { program } from "commander";

import { bootstrapApplication } from "@/bootstrapApplication";
import { bootstrapControllers } from "@/bootstrapControllers";
import { bootstrapServices } from "@/bootstrapServices";

import { definition as definitionTestProjectCommand } from "@/controllers/TestProjectController";

import { name } from "../package.json";

setImmediate(async () => {
  try {
    await bootstrapApplication();
    await bootstrapServices();
    program.name(green(name)).usage(["", green(`${name} command <argument> [options]`)].join("\n"));
    await bootstrapControllers();

    const testCommand = program.command("test").description("这是test相关的命令,是根节点");
    await definitionTestProjectCommand(testCommand);

    program.parse();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
