import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
@Controller('/rpc/users')
export class UserController {

    @Get(':uid')
    async findUser(@Param('uid', ParseIntPipe) uid: number) {
        return { uid };
    }
}
