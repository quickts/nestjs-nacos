import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { NacosLogger } from "./nacos.logger";
import { NACOS_NAMING_OPTION } from "./nacos.naming.constants";
import { NacosNamingOptions, NacosInstanceOptions, NacosInstance } from "./nacos.naming.interface";
const NamingClient = require("nacos").NacosNamingClient;

@Injectable()
export class NacosNamingClient extends NamingClient implements OnModuleInit, OnModuleDestroy {
    readonly metadata: any;
    private instanceOptions: NacosInstanceOptions;
    constructor(@Inject(NACOS_NAMING_OPTION) options: NacosNamingOptions) {
        const metadata = {};
        super({
            ...options.clientOptions,
            metadata: metadata,
            logger: new NacosLogger()
        });
        this.instanceOptions = options.instanceOptions;
        this.metadata = metadata;
    }

    async onModuleInit() {
        await super.ready();
        await super.registerInstance(this.instanceOptions.serviceName, this.instanceOptions, this.instanceOptions.groupName);
    }

    async onModuleDestroy() {
        await super.deregisterInstance(this.instanceOptions.serviceName, this.instanceOptions, this.instanceOptions.groupName);
    }

    // getAllInstances(serviceName: string, groupName?: string, clusters?: string, subscribe?: boolean) {
    //     return super.getAllInstances(serviceName, groupName, clusters, subscribe) as Promise<NacosInstance[]>;
    // }

    // selectInstances(serviceName: string, groupName?: string, clusters?: string, healthy?: boolean, subscribe?: boolean) {
    //     return super.selectInstances(serviceName, groupName, clusters, healthy, subscribe) as Promise<NacosInstance[]>;
    // }

    // getServerStatus() {
    //     return super.getServerStatus() as Promise<"UP" | "DOWN">;
    // }

    // subscribe(info: string | { serviceName: string; groupName?: string; clusters?: string }, listener: (instances: NacosInstance[]) => void) {
    //     super.subscribe(info, listener);
    // }

    // unSubscribe(info: string | { serviceName: string; groupName?: string; clusters?: string }, listener: (instances: NacosInstance[]) => void) {
    //     super.unSubscribe(info, listener);
    // }

    async selectOneHealthyInstance(serviceName: string, groupName?: string, clusters?: string) {
        const instances = await this.selectInstances(serviceName, groupName, clusters, true);
        let totalWeight = 0;
        for (const instance of instances) {
            totalWeight += instance.weight;
        }
        let pos = Math.random() * totalWeight;
        for (const instance of instances) {
            if (pos <= 0) {
                if (instance.weight) {
                    return instance;
                }
            } else {
                pos -= instance.weight;
            }
        }
        throw new Error(`Not found service ${serviceName}!`);
    }
}
