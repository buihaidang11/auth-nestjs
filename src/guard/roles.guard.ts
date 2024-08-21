import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/roles/role.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class RolesGuard implements CanActivate {
    userRoleRepository: any;
    constructor(
        private reflector: Reflector,
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;
        if (!authorizationHeader) {
            throw new UnauthorizedException('Authorization header missing');
        }
        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Token missing');
        }
        const decoded = this.jwtService.verify(token);
        const userId = decoded.sub;

        const userRoles = await this.usersService.findOneWithRole(userId);
        console.log(userRoles);

        const userRoleNames = userRoles.roles.map(userRole => userRole.role);

        return roles.some((role) => userRoleNames.includes(role));
    }
}