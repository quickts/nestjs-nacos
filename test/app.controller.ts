import { Controller, Get, Post, BadRequestException } from "@nestjs/common";
import { AppService } from "./app.service";
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("")
    async hello() {
        return await this.appService.getHello();
    }
}
