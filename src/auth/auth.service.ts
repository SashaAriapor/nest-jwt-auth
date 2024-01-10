import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private readonly repository: DatabaseService,
        private readonly jwtService: JwtService
        ) {}

    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    }

    async onHashPassword(password:string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    async checkPassword(password: string, user: Prisma.UserCreateInput) {
        return this.onHashPassword(password, user.password);
    }   

    async generateTokens(userId: string, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({ sub: userId, email },{
                secret: "secret",
                expiresIn: '15m',
            }),
            this.jwtService.signAsync({ sub: userId, email }, {
                secret: "secret",
                expiresIn: '7d',
            })
        ]);

        return { accessToken, refreshToken };
    }

}

