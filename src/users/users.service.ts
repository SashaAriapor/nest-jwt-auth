import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UsersService {
    constructor(
        private readonly repository: DatabaseService,
        private readonly authService: AuthService
        ) {}

    async findOneUser(where: Prisma.UserWhereUniqueInput) {
        const user = this.repository.user.findFirst({ where });
        return user;
    }


    async create(data: Prisma.UserCreateInput) {
        const { email, first_name, last_name, password } = data;
        const hashedPassword = await this.authService.hashPassword(password);
        const userData = {
            email, 
            first_name, 
            last_name, 
            password: hashedPassword
        };   
        const user = this.repository.user.create({ data: userData });
        return user;
    }

    async updateRefreshToken(where: Prisma.UserWhereUniqueInput, refreshToken: string) {        
        return await this.repository.user.update({ where, data: { refreshToken } })
    }
}
