import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [UsersService, AuthService],
  imports: [JwtModule]
  
})
export class UsersModule {}
