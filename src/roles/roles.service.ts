import { Injectable } from "@nestjs/common";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Role } from "./role.entity";
import { User } from "src/users/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateRoleDto } from "./dto/role.dto";

@Injectable()
export class RolesService {
    constructor(@InjectRepository(Role) private roleRepository: Repository<Role>) { }
    findAll(): Promise<Role[]> {
        return this.roleRepository.find();
    }
    findOne(id: number): Promise<Role> {
        return this.roleRepository.findOne({ where: { id } })
    }
    create(createRoleDto: CreateRoleDto): Promise<Role> {
        return this.roleRepository.save(createRoleDto);

    }
    update(id: number, user: Partial<Role>): Promise<UpdateResult> {
        return this.roleRepository.update(id, user);
    }
    delete(id: number): Promise<DeleteResult> {
        return this.roleRepository.delete(id);
    }
}