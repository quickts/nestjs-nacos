import { Injectable, Inject, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { NACOS_INSTANCE_OPTION } from "./nacos.instance.constants";
import { NacosInstanceOptions } from "./nacos.interface";
import { NacosNamingService } from "./nacos.naming.service";

@Injectable()
export class NacosInstanceService implements OnApplicationBootstrap, OnApplicationShutdown {
    get metadata(): { [key: string]: any } {
        return this.options.metadata;
    }

    constructor(
        @Inject(NACOS_INSTANCE_OPTION)
        private readonly options: NacosInstanceOptions,
        private readonly namingService: NacosNamingService
    ) {
        this.options.metadata = this.options.metadata || {
            node_version: process.version
        };
    }

    async onApplicationBootstrap() {
        await this.namingService.registerInstance(this.options.serviceName, this.options, this.options.groupName);
    }

    async onApplicationShutdown() {
        await this.namingService.deregisterInstance(this.options.serviceName, this.options, this.options.groupName);
    }
}
