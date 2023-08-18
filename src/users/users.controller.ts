import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
    constructor (
        private readonly usersService: UsersService
    ){};

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:string) {
        return this.usersService.findOne(id);
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id:string, @Body() createUserDto: CreateUserDto) {
        return this.usersService.update(id, createUserDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id:string) {
        return this.usersService.remove(id);
    }

}
