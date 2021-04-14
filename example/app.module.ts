import { Module, HttpModule, HttpService } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { NacosNamingGlobalModule, NacosConfigGlobalModule, NacosNamingService } from "../src";
import UserModule from "./user/user.module";

@Module({
    imports: [
        // 此全局模块用来与nacos服务器通信 必须存在
        NacosNamingGlobalModule.forRoot({
            serverList: "127.0.0.1:8848", // nacos服务器的ip
            namespace: "public" // 服务要注册到哪个命名空间, 自己创建的要填命名空间的uuid
        }),
        // 此全局模块用来获取配置文件
        NacosConfigGlobalModule.forRoot({
            serverAddr: "127.0.0.1:8848",// nacos服务器的ip
            namespace: "public" // 服务要注册到哪个命名空间, 自己创建的要填命名空间的uuid
        }),
        HttpModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
    constructor(httpService: HttpService, namingService: NacosNamingService) {
        // 设置interceptor
        // 如果访问的域名以.svc结尾 则去nacos根据权值随机选择一个实例进行连接
        httpService.axiosRef.interceptors.request.use(namingService.axiosRequestInterceptor(/\.svc$/));
    }
}
