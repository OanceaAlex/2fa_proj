import { BadRequestException, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
    
    findAll() {
        return this.userRepository.find();
    }

    async findOne(id: string) {
        const foundUser = await this.userRepository.findOneBy({id: +id});
        if (!foundUser) {
            throw new NotFoundException(`User with id #${id} not found.`);
        }
        return foundUser;
    }

    async findOneByName(username: string) {
        const foundUser = await this.userRepository.findOneBy({username: username});
        if (!foundUser) {
            throw new NotFoundException(`User with name "${username}" not found.`);
        }
        return foundUser;
    }

    async create(createUserDto: CreateUserDto) {
        const {password, ...userDetails} = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userToCreate: CreateUserDto = {
            ...createUserDto,
            password: hashedPassword,
        };
        console.log(userToCreate);
        const createdUser = this.userRepository.create(userToCreate);
        return this.userRepository.save(createdUser);
    }

    async register(createUserDto: CreateUserDto) {
        const foundUser = await this.userRepository.findOneBy({username: createUserDto.username});
        if (foundUser) {
            throw new BadRequestException(`User with given username already exists`);
        }
        return await this.create(createUserDto);
    }

    async update(id:string, createUserDto: CreateUserDto) {
        const updatedUser = await this.userRepository.preload({
            id: +id,
            ...createUserDto,
        })
        if (!updatedUser) {
            throw new NotFoundException(`User with id #${id} not found.`);
        }
        return this.userRepository.save(updatedUser);
    }

    async remove(id: string) {
        const userToRemove = await this.findOne(id);
        return this.userRepository.remove(userToRemove);
    }

    async setTwoFactorAuthSecret(secret: string, userId: number){
        await this.userRepository.update({id: userId}, {twoFactorAuthSecret: secret});
    }

}
