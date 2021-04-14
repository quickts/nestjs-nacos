import { Module, DynamicModule, Global } from "@nestjs/common";
import { NacosInstanceOptions, NacosInstanceAsyncOptions } from "./nacos.interface";
import { createProvider, createAsyncProvider } from "./nacos.instance.provider";
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

    static forRootAsync(options: NacosInstanceAsyncOptions): DynamicModule {
        const provider = createAsyncProvider(options);
        return {
            module: NacosInstanceModule,
            imports: [],
            providers: [provider, NacosInstanceService],
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

    static forRootAsync(options: NacosInstanceAsyncOptions): DynamicModule {
        const provider = createAsyncProvider(options);
        return {
            module: NacosInstanceGlobalModule,
            imports: [],
            providers: [provider, NacosInstanceService],
            exports: [NacosInstanceService]
        };
    }
}
