import { program } from "commander";

import { bootstrapApplication } from "@/bootstrapApplication";
import { bootstrapControllers } from "@/bootstrapControllers";
import { bootstrapServices } from "@/bootstrapServices";

import { name, version } from "../package.json";

setImmediate(async () => {
  try {
    await bootstrapApplication();
    await bootstrapServices();
    program.usage(name).version(version);
    await bootstrapControllers();
    program.parse();
  } catch (error) {
    console.log("error", error);
    process.exit(0);
  };
});
