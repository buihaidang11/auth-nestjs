import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { Role } from "./role.entity";
import { CreateRoleDto } from "./dto/role.dto";
@Controller('roles')
export class RolesController {
    constructor(private rolesService: RolesService) { }

    @Get('/all')
    findAll(): Promise<Role[]> {
        return this.rolesService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: number): Promise<Role> {
        return this.rolesService.findOne(id);
    }
    @Post()
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }
    @Patch('/update/:id')
    update(@Param('id') id: number, @Body() role: Partial<Role>) {
        return this.rolesService.update(id, role);
    }
    @Delete(':id')
    delete(@Param('id') role) {
        return this.rolesService.delete(role.id);
    }
}