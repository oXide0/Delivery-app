import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Customer } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Customer) private usersRepository: Repository<Customer>) {}

    async findById(id: string): Promise<Customer> {
        return await this.usersRepository.findOneBy({ id });
    }

    async create(user: CreateUserDto): Promise<Customer> {
        return await this.usersRepository.save({
            id: uuid(),
            username: user.username,
            password: user.password,
            email: user.email,
            createdAt: new Date(),
        });
    }

    async update(user: UpdateUserDto): Promise<Customer> {
        const existingUser = await this.findById(user.id);
        if (!existingUser) {
            throw new NotFoundException(`User with ID ${user.id} not found`);
        }
        return await this.usersRepository.save(user);
    }

    async delete(id: string): Promise<void> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        await this.usersRepository.delete(id);
    }
}
