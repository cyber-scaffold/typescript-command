import path from "path";
import esbuild from "esbuild";
import { nodeExternalsPlugin } from "esbuild-node-externals";

setImmediate(async () => {
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
});