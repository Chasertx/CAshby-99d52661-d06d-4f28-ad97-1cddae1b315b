import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '../auth/dto/auth.dto';
import { UserRole } from '@task-mgmt/shared-data';

// Manages user records and profile updates.
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  // Checks for existing accounts before creating a new user.
  async create(dto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({ 
      where: { email: dto.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const newUser = this.userRepository.create({
      email: dto.email,
      password: dto.password,
      role: dto.role as UserRole,
      organizationId: dto.organizationId
    });

    console.log('Adding a new user to the system');
    return await this.userRepository.save(newUser);
  }

  // Locates a user by email and includes the hidden password field for validation.
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  // Fetches a single user by their primary key.
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } as any });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Updates user permissions and triggers entity listeners.
  async updateRole(userId: number, newRole: UserRole) {
    const user = await this.userRepository.findOne({ where: { id: userId } as any });
    if (!user) throw new NotFoundException('User not found');

    user.role = newRole;
    console.log(`Switching user ${userId} to role: ${newRole}`);
    return await this.userRepository.save(user);
  }
}