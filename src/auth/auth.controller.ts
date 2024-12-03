import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { AuthStatusDto } from './dto/auth-status.dto';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthDto })
  async login(@Body() DTO: LoginDto): Promise<AuthDto> {
    return this.authService.login(DTO);
  }

  @Post('register')
  @ApiOkResponse({ type: AuthDto })
  async register(@Body() DTO: RegisterDto): Promise<AuthDto> {
    return this.authService.register(DTO);
  }

  @Post('check-auth')
  @ApiOkResponse({ type: AuthStatusDto })
  async checkAuth(@Body() DTO: AuthDto): Promise<AuthStatusDto> {
    return this.authService.checkAuth(DTO);
  }
}
