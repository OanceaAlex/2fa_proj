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

    // Return all users from DB
    @UseGuards(Jwt2faAuthGuard) 
    @ApiBearerAuth()
    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    // Search and return user by DB id
    @UseGuards(Jwt2faAuthGuard)
    @ApiBearerAuth()
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id:string) {
        return this.usersService.findOne(id);
    }

    // Force add user in DB regardless of other users
    @UseGuards(Jwt2faAuthGuard)
    @ApiBearerAuth()
    @Post('create')
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    // Sign up user and store in DB
    @Public()
    @Post('register')
    register(@Body() createUserDto: CreateUserDto) {
        return this.usersService.register(createUserDto);
    }

    // Update user data in db for user with matching id
    @UseGuards(Jwt2faAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id:string, @Body() createUserDto: CreateUserDto) {
        return this.usersService.update(id, createUserDto);
    }

    // Delete user with mathcing id from db
    @UseGuards(Jwt2faAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id:string) {
        return this.usersService.remove(id);
    }

    // Show info about current authenticated user, aka extract data from jwt token
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('/profile')
    getProfile(@Request() req){
        return {
            userid:req.user.id,
            username:req.user.username,
            isTwoFactorAuthEnabled:req.user.isTwoFactorAuthEnabled,
        };
    }

    // test endpoin for 2fa fwt token
    // @UseGuards(Jwt2faAuthGuard)
    // @ApiBearerAuth()
    // @Post('/test')
    // getTest(@Request() req) {
    //     return {
    //         userid:req.user.id,
    //         username:req.user.username,
    //         isTwoFactorAuthEnabled:req.user.isTwoFactorAuthEnabled,
    //     };
    // }

}
