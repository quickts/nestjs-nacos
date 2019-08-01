import { Module, DynamicModule } from "@nestjs/common";
import { NacosNamingOptions } from "./nacos.naming.interface";
import { createProvider } from "./redis.provider";

@Module({})
export class NacosNamingModule {
    static forRoot(options: RedisOptions): DynamicModule {
        const provider = createProvider(options);
        return {
            module: RedisModule,
            providers: [provider],
            exports: [provider]
        };
    }
}
