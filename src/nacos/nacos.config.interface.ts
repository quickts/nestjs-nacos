import { NacosConfigClient } from "nacos";

export interface OnConfigClientInit {
    onConfigClientInit(configClient: NacosConfigClient): any;
}
