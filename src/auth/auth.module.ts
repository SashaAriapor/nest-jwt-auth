import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    UsersService, 
    AccessTokenStrategy, 
    RefreshTokenStrategy],
  imports: [JwtModule.register({})]
})
export class AuthModule {}
