import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { Roles } from "src/roles/roles.decorator";
import { Role } from "src/roles/role.entity";
import { RolesGuard } from "src/guard/roles.guard";
import { CreateUserDto } from "./dto/user-create.dto";
import { UpdateUserDto } from "./dto/user-update.dto";

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('/all')
    @Roles('admin')
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }
    @Get(':username')
    findOne(@Param('username') username: string): Promise<User> {
        return this.usersService.findOne(username);
    }
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get('/roleUser/:id')
    findOneWithRole(@Param('id') id: number): Promise<User> {
        return this.usersService.findOneWithRole(id)
    }

    @Patch('/update/:id')
    update(@Param('id') id: number, @Body() user: Partial<User>) {
        return this.usersService.update(id, user);
    }

    @Patch('/update-role/:id')
    @Roles('admin')
    async updateRoleForUser(
        @Param('id') userId: number,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        // Thực hiện cập nhật thông tin user
        await this.usersService.updateRoleForUser(userId, updateUserDto);

        // Thêm vai trò mới vào bảng user_role
        const roleId = updateUserDto.role_id; // Giả sử bạn gửi roleId trong DTO
        await this.usersService.updateRoleForUser(userId, updateUserDto);

        return { message: 'User updated successfully' };
    }

    @Delete(':id')
    delete(@Param() user) {
        return this.usersService.delete(user.id)
    }
}