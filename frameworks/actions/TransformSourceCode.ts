import path from "path";
import { readFile } from "jsonfile";
import { injectable, inject } from "inversify";
import { Project, ScriptTarget, ModuleKind, ModuleResolutionKind } from "ts-morph";

import { IOCContainer } from "@@/frameworks/cores/IOCContainer";
import { FrameworkBasicConfig } from "@@/frameworks/commons/FrameworkBasicConfig";
import { EngineeringFeatureSupport } from "@@/frameworks/services/EngineeringFeatureSupport";

@injectable()
export class TransformSourceCode {

  private project: Project;

  constructor (
    @inject(FrameworkBasicConfig) private readonly $FrameworkBasicConfig: FrameworkBasicConfig,
    @inject(EngineeringFeatureSupport) private readonly $EngineeringFeatureSupport: EngineeringFeatureSupport
  ) { };

  public async initialize() {
    const { projectDirectory } = this.$FrameworkBasicConfig.getRuntimeConfig();
    /** 加载项目默认的tsconfig.json文件 **/
    const tsConfigFileContent = await readFile(path.relative(projectDirectory, "./tsconfig.json"));
    /** 处理掉compilerOptions中对输出结果有影响的属性 **/
    delete tsConfigFileContent.compilerOptions["jsx"];
    delete tsConfigFileContent.compilerOptions["declaration"];
    tsConfigFileContent.compilerOptions["target"] = ScriptTarget.ESNext;
    tsConfigFileContent.compilerOptions["module"] = ModuleKind.CommonJS;
    tsConfigFileContent.compilerOptions["moduleResolution"] = ModuleResolutionKind.NodeJs;
    tsConfigFileContent.compilerOptions["outDir"] = path.resolve(process.cwd(), "./dist/");
    tsConfigFileContent.exclude = [path.resolve(process.cwd(), "./dist/"), path.resolve(process.cwd(), "./example/")];
    this.project = new Project(tsConfigFileContent);
    this.project.addSourceFilesAtPaths("./src/**/*.{mts,cts,ts}");
  };

  public async processEverySourceCodeFile() {
    /** 获取到所有的源代码管理对象 **/
    const sourceFiles = this.project.getSourceFiles();
    /** 处理每一个源代码文件 **/
    await Promise.all(sourceFiles.map(async (everySourceFile) => {
      this.$EngineeringFeatureSupport.replaceImportAliasToRelativePath(everySourceFile);
      this.$EngineeringFeatureSupport.additionRuntimeESModuleSupport(everySourceFile);
    }));
  };

  public async complateAndGenerate() {
    await this.project.emit();
  };

};


IOCContainer.bind(TransformSourceCode).toSelf().inRequestScope();
