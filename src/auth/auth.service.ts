import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/auth.login-dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (!user) {
      // Hash password
      const hashPassword = await bcrypt.hash(registerDto.password, 10);

      const data = await this.prisma.user.create({
        data: {
          ...registerDto,
          password: hashPassword,
        },
      });
      const token = await this.signToken(data.id,data.email);
      return {
        status : true,
        message : "User created successfully"
      }
    } else {
      throw new ForbiddenException('User already available in DB');
    }
  }


  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Kindly register before loggin in..');
    }
    const verifyPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!verifyPassword) {
      throw new ForbiddenException('Invalid credentials');
    }
    const token = await this.signToken(user.id,user.email);
    return {
      access_token : token,
      status: true,
      message: 'Successfully logged in',
    };
  }


  
  signToken(id: number, email: string) {
    const payload = {
      sub: id,
      email,
    };
    const token = this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRY'),
      secret : this.config.get('JWT_SECRET')
    });

    return token;
  }
}
