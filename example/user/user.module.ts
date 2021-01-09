import { Module } from '@nestjs/common';
import { NacosInstanceModule } from '../../src';
import { UserController } from './user.controller';

@Module({
    imports: [
        // 注册服务 进程中可以注册多个不同的服务
        NacosInstanceModule.forRoot({
            // 当前服务名
            serviceName: 'user.svc',
            // 当前服务的ip 
            // 建议配置到环境变量里通过process.env获取
            // 或者通过第三方库internal-ip 的v4.sync()获取内网ip
            ip: "127.0.0.1",
            // 当前服务对外开放的端口
            // 就是在index.ts里面app.listen的端口
            // 建议统一读取配置获取
            port: 3000
        })
    ],
    controllers: [UserController],
    providers: []
})
export default class UserModule { }
