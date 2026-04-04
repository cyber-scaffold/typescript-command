import fs from "fs";
import path from "path";
import esbuild from "esbuild";
import { promisify } from "util";
import { nodeExternalsPlugin } from "esbuild-node-externals";

import { declaration } from "@@/frameworks/declaration";

setImmediate(async () => {
  await promisify(fs.rm)(path.resolve(process.cwd(), "./dist/"), { recursive: true, force: true });
  await promisify(fs.rm)(path.resolve(process.cwd(), "./types/"), { recursive: true, force: true });
  await esbuild.build({
    entryPoints: [path.resolve(process.cwd(), "./src/index.ts")],
    bundle: true,
    format: "cjs",
    platform: "node",
    outdir: path.resolve(process.cwd(), "./dist/"),
    plugins: [nodeExternalsPlugin({
      packagePath: path.resolve(process.cwd(), "./package.json")
    })]
  });
  await declaration();
});