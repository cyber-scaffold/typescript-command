import path from "path";
import { SyntaxKind } from "ts-morph";
import { injectable, inject } from "inversify";

import { IOCContainer } from "@@/frameworks/cores/IOCContainer";
import { FrameworkBasicConfig } from "@@/frameworks/commons/FrameworkBasicConfig";
import { computedRelativePath } from "@@/frameworks/utils/computedRelativePath";

import type { SourceFile, ImportDeclaration } from "ts-morph";

/**
 * 工程化特性支持类
 * **/
@injectable()
export class EngineeringFeatureSupport {

  constructor (
    @inject(FrameworkBasicConfig) private readonly $FrameworkBasicConfig: FrameworkBasicConfig
  ) { };

  /**
   * 将import中的 @ 这个别名替换成相对路径
   * **/
  public replaceImportAliasToRelativePath(everySourceFile: SourceFile) {
    const { projectDirectory } = this.$FrameworkBasicConfig.getRuntimeConfig();
    /** 计算出项目源代码文件夹的位置 **/
    const sourceCodeDirectoryPath = path.resolve(projectDirectory, "./src/");
    everySourceFile.getImportDeclarations().forEach((importPackagePath) => {
      /** 在 ast中找到的包含 @ 这个alias 的 import 路径 **/
      const importPackageAliasPath = importPackagePath.getModuleSpecifierValue();
      if (importPackageAliasPath.startsWith("@")) {
        /** 当前代码文件的绝对路径 **/
        const sourceCodeFileFullPath = everySourceFile.getFilePath();
        /** 将alias先转换成绝对路径 **/
        const importPackageFullPath = importPackageAliasPath.replace("@", sourceCodeDirectoryPath);
        /** 基于这两个路径进行相对位置计算 **/
        const relativePath = computedRelativePath(sourceCodeFileFullPath, importPackageFullPath);
        /** 覆盖掉原来的import路径 **/
        importPackagePath.setModuleSpecifier(relativePath);
      };
      /** 与上述过程同理,只是换成了处理 @@ 这个指向根目录的alias **/
      if (importPackageAliasPath.startsWith("@@")) {
        const importPackageFullPath = importPackageAliasPath.replace("@@", projectDirectory);
        const sourceCodeFileFullPath = everySourceFile.getFilePath();
        const relativePath = computedRelativePath(sourceCodeFileFullPath, importPackageFullPath);
        importPackagePath.setModuleSpecifier(relativePath);
      };
    });

  };

  /**
   * 增加运行时的esm模块导入支持
   * 引入esbuild-register的polyfill
   * **/
  public additionRuntimeESModuleSupport(everySourceFile: SourceFile) {
    const sourceCodeFileFullPath = everySourceFile.getFilePath();
    const indexSourceCodeFileFullPath = path.resolve(process.cwd(), "./src/index.ts");
    if (sourceCodeFileFullPath === indexSourceCodeFileFullPath) {
      // 找到真正的第一个语句在第一个语句后门进行esbuild-register的polyfill引入
      const statements = everySourceFile.getStatements();
      const firstPosition = statements[0].getStart();
      everySourceFile.insertText(firstPosition, `require("esbuild-register");`);
    };
  };

};

IOCContainer.bind(EngineeringFeatureSupport).toSelf().inRequestScope();
