import { program } from "commander";

import { bootstrapApplication } from "@/bootstrapApplication";
import { bootstrapServices } from "@/bootstrapServices";
import { bootstrapControllers } from "@/bootstrapControllers";

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
