import { injectable, inject } from "inversify";

import { TransientService } from "@/services/TransientService";
/**
 * 会话级别的服务就特别适合用 RequestScope 作用域
 * 需要在中间件或者入口函数处使用container.createChild()初始化
 * **/
@injectable()
export class SessionInfoService {

  constructor(
    @inject(TransientService) private readonly transientService: TransientService
  ) { };

  public async getSessionInfo() {
    console.log(await this.transientService.execute());
  };

};