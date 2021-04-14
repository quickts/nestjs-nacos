import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { AxiosRequestConfig } from "axios";
import { NacosLogger } from "./nacos.logger";
import { NACOS_NAMING_OPTION } from "./nacos.naming.constants";
import { NacosNamingOptions, NacosInstance, NacosInstanceOptions } from "./nacos.interface";
const { NacosNamingClient } = require("nacos");

@Injectable()
export class NacosNamingService implements OnModuleInit, OnModuleDestroy {
    private namingClient: any;
    constructor(@Inject(NACOS_NAMING_OPTION) options: NacosNamingOptions) {
        const logger = new NacosLogger(options.loggerLevel);
        this.namingClient = new NacosNamingClient({
            ...options,
            logger: logger,
        });

        // const _serverProxy = this.namingClient._serverProxy;
        // const _beatReactor = this.namingClient._beatReactor;
        // const _beat = _beatReactor._beat;
        // _beatReactor._beat = async function (beatInfo) {
        //     try {
        //         const params = {
        //             namespaceId: _serverProxy.namespace,
        //             serviceName: beatInfo.serviceName,
        //             clusterName: beatInfo.cluster,
        //             ip: beatInfo.ip,
        //             port: beatInfo.port + "",
        //             metadata: JSON.stringify(beatInfo.metadata),
        //         };
        //         await _serverProxy._reqAPI("/nacos/v1/ns/instance", params, "PUT");
        //     } catch (err) {
        //         logger.error(err);
        //     }
        //     return await _beat.call(this, beatInfo);
        // };
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

    axiosRequestInterceptor(matchReg: RegExp) {
        return async (config: AxiosRequestConfig) => {
            const results = /(?<=:\/\/)[a-zA-Z\.\-_0-9]+(?=\/|$)/.exec(config.url);
            if (results && results.length) {
                const serviceName = results[0];
                if (matchReg.test(serviceName)) {
                    const service = await this.selectOneHealthyInstance(serviceName);
                    config.url = config.url.replace(serviceName, `${service.ip}:${service.port}`);
                }
            }
            return config;
        };
    }
}
