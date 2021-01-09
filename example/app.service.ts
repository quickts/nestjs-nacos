import { Injectable, HttpService } from "@nestjs/common";
import { Config } from "../src";
@Injectable()
export class AppService {
    // 获取nacos中配置的配置 如果有修改 此处会自动同步
    @Config("test.json")
    testConfig: { len: number } = undefined as any;

    constructor(private readonly httpService: HttpService) { }

    async getHello() {
        // 请求user.svc服务 获取玩家 id=100 的信息
        const res = await this.httpService.axiosRef.get('http://user.svc/rpc/users/100');
        return {
            hello: "Hello World!",
            testConfig: this.testConfig,
            userInfo: res.data
        };
    }
    //
}
