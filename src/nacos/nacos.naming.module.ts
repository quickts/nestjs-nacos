import { Module, DynamicModule, Global } from "@nestjs/common";
import { NacosNamingOptions } from "./nacos.interface";
import { createProvider } from "./nacos.naming.provider";
import { NacosNamingService } from "./nacos.naming.service";

@Global()
@Module({})
export class NacosNamingGlobalModule {
    static forRoot(options: NacosNamingOptions): DynamicModule {
        const provider = createProvider(options);
        return {
            module: NacosNamingGlobalModule,
            imports: [],
            providers: [provider, NacosNamingService],
            exports: [NacosNamingService]
        };
    }
}
