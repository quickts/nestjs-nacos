import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
(async function () {
    try {
        const app = await NestFactory.create(AppModule);
        await app.listen(3080, "0.0.0.0");
    } catch (err) {
        console.log(err);
        Logger.error(err.message);
        process.exit();
    }
})();
