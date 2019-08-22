import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { NacosLogger } from "./nacos.logger";
import { NACOS_NAMING_OPTION } from "./nacos.naming.constants";
import { NacosNamingOptions, NacosInstance, NacosInstanceOptions } from "./nacos.interface";
const NacosNamingClient = require("nacos").NacosNamingClient;

@Injectable()
export class NacosNamingService implements OnModuleInit, OnModuleDestroy {
    private namingClient: any;
    constructor(@Inject(NACOS_NAMING_OPTION) options: NacosNamingOptions) {
        this.namingClient = new NacosNamingClient({
            ...options,
            logger: new NacosLogger(options.loggerLevel)
        });
    }

    async onModuleInit() {
        await this.namingClient.ready();
    }

    async onModuleDestroy() {
        await this.namingClient.close();
    }

    registerInstance(serviceName: string, instance: NacosInstanceOptions, groupName?: string) {
        return this.namingClient.registerInstance(serviceName, instance, groupName) as Promise<void>;
    }

    deregisterInstance(serviceName: string, instance: NacosInstanceOptions, groupName?: string) {
        return this.namingClient.deregisterInstance(serviceName, instance, groupName) as Promise<void>;
    }

    getAllInstances(serviceName: string, groupName?: string, clusters?: string, subscribe?: boolean) {
        return this.namingClient.getAllInstances(serviceName, groupName, clusters, subscribe) as Promise<NacosInstance[]>;
    }

    selectInstances(serviceName: string, groupName?: string, clusters?: string, healthy?: boolean, subscribe?: boolean) {
        return this.namingClient.selectInstances(serviceName, groupName, clusters, healthy, subscribe) as Promise<NacosInstance[]>;
    }

    getServerStatus() {
        return this.namingClient.getServerStatus() as Promise<"UP" | "DOWN">;
    }

    subscribe(info: string | { serviceName: string; groupName?: string; clusters?: string }, listener: (instances: NacosInstance[]) => void) {
        return this.namingClient.subscribe(info, listener);
    }

    unSubscribe(info: string | { serviceName: string; groupName?: string; clusters?: string }, listener: (instances: NacosInstance[]) => void) {
        return this.namingClient.unSubscribe(info, listener);
    }

    async selectOneHealthyInstance(serviceName: string, groupName?: string, clusters?: string) {
        const instances = await this.namingClient.selectInstances(serviceName, groupName, clusters, true);
        let totalWeight = 0;
        for (const instance of instances) {
            totalWeight += instance.weight;
        }
        let pos = Math.random() * totalWeight;
        for (const instance of instances) {
            if (instance.weight) {
                pos -= instance.weight;
                if (pos <= 0) {
                    return instance as NacosInstance;
                }
            }
        }
        throw new Error(`Not found healthy service ${serviceName}!`);
    }

    axiosRequestInterceptor(protocol?: string, replace: string = "http") {
        return async (config: AxiosRequestConfig) => {
            const protocolResults = /[a-z]+(?=:\/\/)/.exec(config.url);
            if (!(protocolResults && protocolResults.length)) {
                return config;
            }
            const reqProtocol = protocolResults[0];
            let needReplace = true;
            if (protocol) {
                needReplace = protocol === reqProtocol;
            }
            if (needReplace) {
                const results = /(?<=:\/\/)[a-zA-Z\.0-9]+(?=\/|$)/.exec(config.url);
                if (results && results.length) {
                    const service = await this.selectOneHealthyInstance(results[0]);
                    config.url = [replace, "://", service.ip, ":", service.port, config.url.substr(results.index + results[0].length)].join("");
                }
            }
            return config;
        };
    }
}
