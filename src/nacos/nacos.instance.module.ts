import { Module, DynamicModule, Global } from "@nestjs/common";
import { NacosInstanceOptions } from "./nacos.interface";
import { createProvider } from "./nacos.instance.provider";
import { NacosInstanceService } from "./nacos.instance.service";

@Module({})
export class NacosInstanceModule {
    static forRoot(options: NacosInstanceOptions): DynamicModule {
        return {
            module: NacosInstanceModule,
            providers: [createProvider(options), NacosInstanceService],
            exports: [NacosInstanceService]
        };
    }
}

@Global()
@Module({})
export class NacosInstanceGlobalModule {
    static forRoot(options: NacosInstanceOptions): DynamicModule {
        return {
            module: NacosInstanceGlobalModule,
            providers: [createProvider(options), NacosInstanceService],
            exports: [NacosInstanceService]
        };
    }
}
