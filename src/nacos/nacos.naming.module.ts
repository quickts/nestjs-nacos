import { Module, DynamicModule } from "@nestjs/common";
import { NacosNamingOptions } from "./nacos.naming.interface";
import { createProvider } from "./nacos.naming.provider";
import { NacosNamingClient } from "./nacos.naming.client";

@Module({})
export class NacosNamingModule {
    static forRoot(options: NacosNamingOptions): DynamicModule {
        const provider = createProvider(options);
        return {
            module: NacosNamingModule,
            providers: [provider, NacosNamingClient],
            exports: [NacosNamingClient]
        };
    }
}
