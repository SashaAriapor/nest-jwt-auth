import { Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
    ) {}

  @Post("/signup")
  async singup(@Body() dto: RegisterDto) {
    const userExists = await this.userService.findOneUser({ email: dto.email });
    if(userExists) return { status: 422, message: "user already exists" }
    const user = await this.userService.create(dto);
    return { user, status: 201, message: "create user was successfully" }
  }

  @Post("/signin")
  async singin(@Body() dto: LoginDto) {
    const user = await this.userService.findOneUser({ email: dto.email });
    if(!user) return { status: 400, message: "email or password is wrong" }
    const checkPassword = await this.authService.checkPassword(dto.password, user);
    if(!checkPassword) return { status: 400, message: "email or password is wrong" }
    const tokens = await this.authService.generateTokens(user.id, user.email);
    await this.userService.updateRefreshToken({ email: user.email }, tokens.refreshToken);
    return { tokens, status: 200, message: "user login successfully" }
  }

  @UseGuards(AccessTokenGuard)
  @Get("/logout")
  async logout(@Req() req: Request) {
    await this.userService.updateRefreshToken({ id: req.user['sub'] }, "");
  }

  @UseGuards(RefreshTokenGuard)
  @Get("/refresh")
  async refreshToken(@Req() req: Request) {
    const user = await this.userService.findOneUser({ id: req.user['sub'] });
    if(!user) throw new ForbiddenException('Access Denied');
    if(user.refreshToken !== req.user['refreshToken']) throw new ForbiddenException('Access Denied');
    const tokens = await this.authService.generateTokens(user.id, user.email);
    await this.userService.updateRefreshToken({ email: user.email }, tokens.refreshToken);
    return { tokens, status: 200, message: "refreshed" }
  }
}
