import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { AuthService } from './auth.service';
import { AdminDto, LogoutDto, UserLoginDto, UserSignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // admin auth routes
  @Post('admin/signup')
  @HttpCode(HttpStatus.CREATED)
  adminSignup(@Body() dto: AdminDto) {
    return this.authService.signup(dto);
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  adminLogin(@Body() dto: AdminDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard)
  @Post('admin/logout')
  @HttpCode(HttpStatus.OK)
  adminLogout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  refreshToken(@Body() dto: LogoutDto) {
    return this.authService.refreshToken(dto);
  }
  // users auth routes
  @Post('user/signup')
  @HttpCode(HttpStatus.CREATED)
  userSignup(@Body() dto: UserSignupDto) {
    return this.authService.userSignup(dto);
  }

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  userLogin(@Body() dto: UserLoginDto) {
    return this.authService.userLogin(dto);
  }

  @UseGuards(AuthGuard)
  @Post('user/logout')
  @HttpCode(HttpStatus.OK)
  userLogout(@Body() dto: LogoutDto) {
    return this.authService.logout(dto);
  }
}
