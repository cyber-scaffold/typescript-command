#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const { promisify } = require("util");
const pathExists = require("path-exists");
const { transform } = require("@babel/core");
const { transpileModule } = require("typescript");

const dist_directory_path = path.resolve(process.cwd(), "./dist/");
const source_directory_path = path.resolve(process.cwd(), "./src/");

(async () => {
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
    const source_file_content = await promisify(fs.readFile)(single_source_file_path, "utf-8");
    const dist_code_directory = path.dirname(dist_code_path);
    if (!await pathExists(dist_code_directory)) {
      await promisify(fs.mkdir)(dist_code_directory, { recursive: true });
    };
    /** 编译单个typescript文件 **/
    const { outputText } = transpileModule(source_file_content, {
      "compilerOptions": {
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        "target": "es2016",
        "module": "commonjs",
        "baseUrl": "../src/",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": false,
        "skipLibCheck": true,
        "sourceMap": true,
        "paths": {
          "@/*": ["./*"],
          "@@/*": ["../*"]
        }
      }
    });
    /** 保存转换后的文件 **/
    await promisify(fs.writeFile)(dist_code_path, outputText);
  });
  await Promise.all(compair_transcation);
  /** 匹配所有的js文件 **/
  const source_jscode_path = path.resolve(dist_directory_path, "./**/*.js");
  const source_code_jsfiles = await promisify(glob)(source_jscode_path);
  const babel_compair_transcation = source_code_jsfiles.map(async (single_source_file_path) => {
    const outputText = await promisify(fs.readFile)(single_source_file_path, "utf-8");
    /** 替换文件中的路径别名 **/
    const after_path_replace = transform(outputText, {
      plugins: [
        ["babel-plugin-module-resolver", {
          root: [path.resolve(process.cwd(), "../")],
          alias: {
            "@": dist_directory_path,
            "@@": process.cwd()
          },
        }]
      ]
    });
    /** 保存转换后的文件 **/
    await promisify(fs.writeFile)(single_source_file_path, after_path_replace.code);
  });
  await Promise.all(babel_compair_transcation);
  await import("../dist/index.js");
})();
