import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

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

    async create(createUserDto: CreateUserDto) {
        const createdUser = this.userRepository.create(createUserDto);
        return this.userRepository.save(createdUser);
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

}
