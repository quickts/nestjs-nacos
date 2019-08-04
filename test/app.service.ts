import { Injectable } from "@nestjs/common";
import { Config, NacosNamingClient } from "./../src";
@Injectable()
export class AppService {
    @Config("test")
    testConfig: { len: number } = undefined as any;

    constructor(private readonly namingClient: NacosNamingClient) {}

    async getHello() {
        // this.namingClient.diapatchEvent("game-over", "aha");
        const instance = await this.namingClient.selectOneHealthyInstance("nodejs.test.domain");
        return {
            hello: "Hello World!",
            len: this.testConfig.len,
            instance: instance
        };
    }
    //
}
