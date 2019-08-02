import { Module, DynamicModule } from "@nestjs/common";
import { NacosConfigOptions } from "./nacos.config.interface";
import { createProvider } from "./nacos.config.provider";

@Module({})
export class NacosConfigModule {
    static forRoot(options: NacosConfigOptions): DynamicModule {
        const provider = createProvider(options);
        return {
            module: NacosConfigModule,
            providers: [provider],
            exports: [provider]
        };
    }
}
