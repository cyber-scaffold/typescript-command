import path from "path";
import { Project } from "ts-morph";
import { readFile } from "jsonfile";

export async function declaration() {
  /** 以下是生成DTS类型注释的逻辑 **/
  const tsConfigFileContent = await readFile(path.resolve(process.cwd(), "./tsconfig.json"));
  /** 处理掉compilerOptions中对输出结果有影响的属性 **/
  delete tsConfigFileContent.compilerOptions["target"];
  delete tsConfigFileContent.compilerOptions["module"];
  delete tsConfigFileContent.compilerOptions["moduleResolution"];
  tsConfigFileContent.compilerOptions["outDir"] = path.resolve(process.cwd(), "./types/");
  tsConfigFileContent.compilerOptions["declaration"] = true;
  tsConfigFileContent.compilerOptions["emitDeclarationOnly"] = true;
  const project = new Project(tsConfigFileContent);
  project.addSourceFilesAtPaths("./src/**/*.ts");
  /** 获取到所有的源代码管理对象 **/
  const sourceFiles = project.getSourceFiles();
  /** 计算出当前项目的绝对路径 **/
  const projectDirectory = path.resolve(process.cwd(), "./src/");
  /** 循环处理源代码中的路径别名 **/
  sourceFiles.forEach((everySourceFile) => {
    everySourceFile.getImportDeclarations().forEach((importPackagePath) => {
      const module = importPackagePath.getModuleSpecifierValue();
      if (module.startsWith("@")) {
        const sourceFileDirectoryPath = everySourceFile.getDirectoryPath();
        const relativePath = path.relative(sourceFileDirectoryPath, projectDirectory);
        importPackagePath.setModuleSpecifier(module.replace("@", relativePath));
      };
      if (module.startsWith("@@")) {
        const sourceFileDirectoryPath = everySourceFile.getDirectoryPath();
        const relativePath = path.relative(sourceFileDirectoryPath, projectDirectory);
        importPackagePath.setModuleSpecifier(module.replace("@", relativePath));
      };
    });
  });
  await project.emit();
};