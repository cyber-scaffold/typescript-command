#!/usr/bin/env node
const fs = require("fs");
const os = require("os");
const path = require("path");
const glob = require("glob");
const { promisify } = require("util");
const pathExists = require("path-exists");
const { transpileModule } = require("typescript");
const { replaceTscAliasPaths } = require("tsc-alias");
const tsConfigJson = require("../tsconfig.json");

const dist_directory_path = path.resolve(__dirname, "../dist/");
const source_directory_path = path.resolve(__dirname, "../src/");

(async () => {

  /** 检测.npmrc文件是否存在，如果不存在的话就说明当前属于发行版,运行时不会编译 **/

  const isPublishd = !(await pathExists(path.resolve(__dirname, "../.npmrc")));

  /** 检查dist文件夹是否存在,不存在的话就创建 **/
  if (!await pathExists(dist_directory_path)) {
    await promisify(fs.mkdir)(dist_directory_path, { recursive: true });
  };
  const source_tscode_path = path.resolve(source_directory_path, "./**/*.{ts,js}");
  /** 匹配所有的ts文件 **/
  const source_code_tsfiles = await promisify(glob)(source_tscode_path);
  /** 执行ts文件的编译事务 **/
  const compair_transcation = source_code_tsfiles.map(async (single_source_file_path) => {
    const dist_code_path = single_source_file_path.replace(source_directory_path, dist_directory_path).replace(".ts", ".js");
    if (await pathExists(dist_code_path)) {
      if (isPublishd) { return false };
    };
    const source_file_content = await promisify(fs.readFile)(single_source_file_path, "utf-8");
    const dist_code_directory = path.dirname(dist_code_path);
    if (!await pathExists(dist_code_directory)) {
      await promisify(fs.mkdir)(dist_code_directory, { recursive: true });
    };
    /** 编译单个typescript文件 **/
    const { outputText } = transpileModule(source_file_content, { ...tsConfigJson });
    /** 保存转换后的文件 **/
    await promisify(fs.writeFile)(dist_code_path, outputText);
    await replaceTscAliasPaths({
      configFile: path.resolve(__dirname, "../tsconfig.json")
    });
  });
  await Promise.all(compair_transcation);
  await require("../dist/index.js");
})();