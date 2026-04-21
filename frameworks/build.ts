import { IOCContainer } from "@@/frameworks/cores/IOCContainer";
import { FrameworkBasicConfig } from "@@/frameworks/commons/FrameworkBasicConfig";

import { ClearDirectory } from "@@/frameworks/actions/ClearDirectory";
import { GenerateDeclaration } from "@@/frameworks/actions/GenerateDeclaration";
import { TransformSourceCode } from "@@/frameworks/actions/TransformSourceCode";

setImmediate(async () => {
  await IOCContainer.get(FrameworkBasicConfig).initialize();
  await IOCContainer.get(ClearDirectory).execute();

  const $TransformSourceCode = IOCContainer.get(TransformSourceCode);
  await $TransformSourceCode.initialize();
  await $TransformSourceCode.processEverySourceCodeFile();
  await $TransformSourceCode.complateAndGenerate();

  const $GenerateDeclaration = IOCContainer.get(GenerateDeclaration);
  await $GenerateDeclaration.initialize();
  await $GenerateDeclaration.processEverySourceCodeFile();
  await $GenerateDeclaration.complateAndGenerate();
});