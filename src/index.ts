#!/usr/bin/env node
import { green } from "colors";
import { program } from "commander";

import { bootstrapApplication } from "@/bootstrapApplication";
import { bootstrapControllers } from "@/bootstrapControllers";
import { bootstrapServices } from "@/bootstrapServices";

import { definition as testController } from "@/controllers/TestController";

import { name, version } from "../package.json";

setImmediate(async () => {
  try {
    await bootstrapApplication();
    await bootstrapServices();
    program.name(green(name)).usage(["", green(`${name} command <argument> [options]`)].join("\n")).version(version);
    await bootstrapControllers();
    await testController(program);
    program.parse();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
