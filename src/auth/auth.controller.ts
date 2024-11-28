import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CheckAuthDto } from './dto/checkAuth.dto';

import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @Post('register')
  @ApiOkResponse({ type: AuthEntity })
  register(@Body() RegisterDto: RegisterDto) {
    return this.authService.register(RegisterDto);
  }

  @Post('check-auth')
  @ApiOkResponse({ type: AuthEntity })
  checkAuth(@Body() CheckAuthDto: CheckAuthDto) {
    return this.authService.checkAuth(CheckAuthDto);
  }
}
