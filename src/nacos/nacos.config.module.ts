import { Module, DynamicModule, Global } from "@nestjs/common";
import { ScannerModule } from "@quickts/nestjs-scanner";
import { ClientOptions } from "nacos";
import { createProvider } from "./nacos.config.provider";
import { NacosConfigService } from "./nacos.config.service";

@Module({})
export class NacosConfigModule {
    static forRoot(options: ClientOptions): DynamicModule {
        const provider = createProvider(options);
        return {
            module: NacosConfigModule,
            imports: [ScannerModule.forRoot(false)],
            providers: [provider, NacosConfigService],
            exports: [NacosConfigService]
        };
    }
}

@Global()
@Module({})
export class NacosConfigGlobalModule {
    static forRoot(options: ClientOptions): DynamicModule {
        const provider = createProvider(options);
        return {
            module: NacosConfigGlobalModule,
            imports: [ScannerModule.forRoot(true)],
            providers: [provider, NacosConfigService],
            exports: [NacosConfigService]
        };
    }
}
