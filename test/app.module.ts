import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { NacosNamingModule, NacosConfigModule } from "./../src";

@Module({
    imports: [
        NacosNamingModule.forRoot({
            clientOptions: {
                serverList: "127.0.0.1:8848", // replace to real nacos serverList
                namespace: "public"
            },
            instanceOptions: {
                serviceName: "nodejs.test.domain",
                ip: "1.1.1.1",
                port: 8080
            }
        }),

        NacosConfigModule.forRoot({
            serverAddr: "127.0.0.1:8848"
        })
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
