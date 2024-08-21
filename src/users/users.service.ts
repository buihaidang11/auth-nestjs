import { Injectable, NotFoundException } from "@nestjs/common";
import { DeleteResult, QueryRunner, Repository, UpdateResult, getConnection } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/roles/role.entity";
import { CreateUserDto } from "./dto/user-create.dto";
import { UpdateUserDto } from "./dto/user-update.dto";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Role) private roleRepository: Repository<Role>
    ) { }
    findAll(): Promise<User[]> {
        return this.userRepository.find()
    }
    findOne(username: string): Promise<User> {
        return this.userRepository.findOne({ where: { username } })
    }
    async create(createUserDto: CreateUserDto): Promise<User> {

        const newUser = this.userRepository.create(createUserDto);

        const defaultRole = await this.roleRepository.findOne({ where: { id: 1 } });

        newUser.roles = [defaultRole]

        return this.userRepository.save(newUser)
    }

    findOneWithRole(userId: number): Promise<User> {
        return this.userRepository.findOne({ where: { id: userId }, relations: ['roles'] });
    }
    update(id: number, user: Partial<User>): Promise<UpdateResult> {
        return this.userRepository.update(id, user);
    }

    async updateRoleForUser(userId: number, updateUserDto: UpdateUserDto): Promise<void> {
        const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['roles'] })

        if (!user) {
            throw new Error('User not found');
        }

        user.username = updateUserDto.username || user.username;
        user.password = updateUserDto.password || user.password;


        if (updateUserDto.role_id) {
            const role = await this.roleRepository.findOne({ where: { id: updateUserDto.role_id } });
            if (role) {
                // Thêm đối tượng Role vào mảng roles của user
                user.roles.push(role);
            } else {
                throw new Error('Role not found');
            }
        }


        await this.userRepository.save(user);
    }

    delete(id: number): Promise<DeleteResult> {
        return this.userRepository.delete(id);
    }
}