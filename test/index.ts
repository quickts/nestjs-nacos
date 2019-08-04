import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NacosConfigClient } from "./../src";
(async function() {
    try {
        const app = await NestFactory.create(AppModule);
        const configClient = app.get(NacosConfigClient);
        configClient.initialize(Reflect.get(app, "container"));
        await app.listen(3000, "0.0.0.0");
    } catch (err) {
        Logger.error(err.message);
        process.exit();
    }
})();
