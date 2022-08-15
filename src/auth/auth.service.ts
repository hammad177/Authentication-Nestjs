import {
  ForbiddenException,
  HttpException,
  Injectable,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminDto, LogoutDto, UserLoginDto, UserSignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtUtils } from 'src/utils/JwtUtils.service';
import { JwtPayload } from 'src/interface';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtUtils) {}

  async signup(dto: AdminDto) {
    try {
      // hash admin password
      const hash = await argon.hash(dto.password);
      // create admin object
      const data = {
        email: dto.email,
        password: hash,
      };
      // save the new admin in the database
      const admin = await this.prisma.admin.create({
        data,
      });
      // get refresh and access tokens
      const tokens = this.createSession(admin);

      return tokens;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // unique violation error
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials are already taken');
        }
      }
      throw new HttpException(
        { status: false, message: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async userSignup(dto: UserSignupDto) {
    try {
      // hash users password
      const hash = await argon.hash(dto.password);
      // create users object
      const data = {
        email: dto.email,
        username: dto.username,
        password: hash,
      };
      // save the new admin in the database
      const user = await this.prisma.users.create({
        data,
      });
      // get refresh and access tokens
      const tokens = this.createSession(user);

      return tokens;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        // unique violation error
        if (err.code === 'P2002') {
          throw new ForbiddenException('Credentials are already taken');
        }
      }
      throw new HttpException(
        { status: false, message: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(dto: AdminDto) {
    // find the admin by email
    const admin = await this.prisma.admin.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if no admin found
    if (!admin) {
      throw new ForbiddenException('Invalid Email');
    }
    // compare passwords
    const pwMatch = await argon.verify(admin.password, dto.password);
    // if password not match
    if (!pwMatch) {
      throw new ForbiddenException('Invalid Credentials');
    }
    // get refresh and access tokens
    const tokens = this.createSession(admin);

    return tokens;
  }

  async userLogin(dto: UserLoginDto) {
    // find the admin by email
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if no user found
    if (!user) {
      throw new ForbiddenException('Invalid Email');
    }
    // compare passwords
    const pwMatch = await argon.verify(user.password, dto.password);
    // if password not match
    if (!pwMatch) {
      throw new ForbiddenException('Invalid Credentials');
    }
    // get refresh and access tokens
    const tokens = this.createSession(user);

    return tokens;
  }

  async logout(dto: LogoutDto) {
    const decodedToken = this.jwt.verifyToken(
      'refresh_token',
      dto.refresh_token,
    );

    // send exception if token is expire
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    // find and delete token/session into the database
    const session = await this.prisma.sessions.deleteMany({
      where: {
        userId: decodedToken.id,
        token: dto.refresh_token,
      },
    });

    // send exception if token not present into the database
    if (!session.count) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    return { status: true, message: 'user logout successfully' };
  }

  async refreshToken(dto: LogoutDto) {
    const decodedToken = this.jwt.verifyToken(
      'refresh_token',
      dto.refresh_token,
    );

    // send exception if token is expire
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid Token');
    }

    // find token in the database
    const token = await this.prisma.sessions.findFirst({
      where: {
        userId: decodedToken.id,
        token: dto.refresh_token,
      },
    });

    // send exception if token not present into the database
    if (!token) {
      throw new UnauthorizedException('Invalid Token');
    }

    // generate new access token and send back to the user
    const payload = {
      id: decodedToken.id,
      email: decodedToken.email,
    };
    const access_token = this.jwt.generateAccessTokens(payload);

    return { access_token };
  }

  async createSession(admin: JwtPayload) {
    const payload = {
      id: admin.id,
      email: admin.email,
    };
    // generate refresh and access tokens
    const access_token = this.jwt.generateAccessTokens(payload);
    const refresh_token = this.jwt.generateRefreshTokens(payload);

    // make hash of refresh token
    const token_hash = await argon.hash(refresh_token);

    // save refresh token into the database
    const data = {
      userId: admin.id,
      token: refresh_token,
    };
    await this.prisma.sessions.create({ data });

    return {
      access_token,
      refresh_token,
    };
  }
}
