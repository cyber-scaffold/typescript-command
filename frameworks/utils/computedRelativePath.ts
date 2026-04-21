import path from "path";
// import { green, yellow } from "colors";

export function computedRelativePath(sourceCodeFileFullPath: string, importPackageFullPath: string) {
  const sourceCodeFileFullDirectoryPath = path.dirname(sourceCodeFileFullPath);
  const importPackageFullDirectoryPath = path.dirname(importPackageFullPath);
  const basename = path.basename(importPackageFullPath);
  const result = path.relative(sourceCodeFileFullDirectoryPath, importPackageFullDirectoryPath);
  // console.log(green("sourceCodeFileFullDirectoryPath"), green(sourceCodeFileFullDirectoryPath), "\n", yellow("importPackageFullDirectoryPath"), yellow(importPackageFullDirectoryPath), "\n", "result", result);
  if (!result) {
    const comboPath = [".", basename].join("/");
    // console.log("importPackageFullPath", importPackageFullPath, "result", result, Boolean(result), "comboPath", comboPath);
    return comboPath;
  };
  if (!result.startsWith(".")) {
    const comboPath = [".", result, basename].join("/");
    // console.log("result", result, "basename", basename, "comboPath", comboPath);
    return comboPath;
  };
  return [result, basename].join("/");
};