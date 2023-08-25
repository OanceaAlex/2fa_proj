import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public-decorator';
import { Jwt2faAuthGuard } from 'src/common/guards/jwt-2fa-auth.guard';

@Controller('users')
export class UsersController {
    constructor (
        private readonly usersService: UsersService
    ){};

    @UseGuards(JwtAuthGuard) 
    @ApiBearerAuth()
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:string) {
        return this.usersService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('create')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Public()
    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.register(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id:string, @Body() createUserDto: CreateUserDto) {
        return this.usersService.update(id, createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id:string) {
        return this.usersService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('/profile')
    getProfile(@Request() req){
        return req.user;
    }

    @UseGuards(Jwt2faAuthGuard)
    @ApiBearerAuth()
    @Post('/test')
    getTest(@Request() req) {
        return req.user;
    }

}
