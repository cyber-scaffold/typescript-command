import path from "path";
import { readFile } from "jsonfile";

const packageJSONPath = path.resolve(process.cwd(), "./package.json");

export async function readPackageJSON() {
  const packageJSONContent = await readFile(packageJSONPath);
  return packageJSONContent;
};