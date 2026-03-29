const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const { promisify } = require("util");
const { nodeExternalsPlugin } = require("esbuild-node-externals");

setImmediate(async () => {
  await promisify(fs.rm)(path.resolve(process.cwd(), "./dist/"), { recursive: true, force: true });
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
  require("../dist/index.js");
});