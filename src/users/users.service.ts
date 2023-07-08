import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email } = createUserDto;
    const user = new User();
    user.name = name;
    user.email = email;
    return this.usersRepository.save(user);
  }
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) throw new Error('User not found');
      const { name, email } = updateUserDto;
      user.name = name ?? user.name;
      user.email = email ?? user.email;
      return this.usersRepository.save(user);
    } catch (error) {
      // Log the error for debugging purposes
      // console.error(error);

      // Return a more meaningful error response to the client
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteOne(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
  async deleteAll(): Promise<void> {
    await this.usersRepository.clear();
  }
}
