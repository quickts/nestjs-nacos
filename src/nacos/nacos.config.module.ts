import { Module, DynamicModule } from "@nestjs/common";
import { NacosConfigOptions } from "./nacos.config.interface";
import { createProvider } from "./nacos.config.provider";
import { NacosConfigClient } from "./nacos.config.client";

@Module({})
export class NacosConfigModule {
    static forRoot(options: NacosConfigOptions): DynamicModule {
        const provider = createProvider(options);
        return {
            module: NacosConfigModule,
            providers: [provider, NacosConfigClient],
            exports: [NacosConfigClient]
        };
    }
}
