import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      return { access_token: null, user: null, error: { code:'wrong_credentials', message: 'Invalid credentials'} };
    }

    // Generate secure token and its hash
    const secureToken = this.generateSecureToken();
    const tokenHash = this.hashToken(secureToken);
    
    // Store token hash in database
    await this.usersService.updateTokenHash(user.id, tokenHash);

    // Create JWT payload with secure token
    const payload = { 
      email: user.email, 
      sub: user.id, 
      token: secureToken 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
      error: null,
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      return { access_token: null, user: null, error: { code:'user_exists', message: 'User already exists'} };
    }

    const user = await this.usersService.create(registerDto);
    
    // Generate secure token and its hash for new user
    const secureToken = this.generateSecureToken();
    const tokenHash = this.hashToken(secureToken);
    
    // Store token hash in database
    await this.usersService.updateTokenHash(user.id, tokenHash);

    // Create JWT payload with secure token
    const payload = { 
      email: user.email, 
      sub: user.id, 
      token: secureToken 
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
      error: null,
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findOneWithPassword(userId);
    if (!user) {
      return { message: 'User not found', error: { code: 'user_not_found', message: 'User not found' } };
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    await this.usersService.update(userId, {
      password: changePasswordDto.newPassword,
    });

    return { message: 'Password changed successfully', error: null};
  }

  async logout(userId: number) {
    // Clear the token hash from database to invalidate all existing tokens
    await this.usersService.clearTokenHash(userId);
    return { message: 'Logged out successfully' };
  }

  async validateToken(payload: any): Promise<any> {
    if (!payload.token) {
      return null;
    }

    // Hash the token from JWT payload
    const tokenHash = this.hashToken(payload.token);
    
    // Find user with matching token hash
    const user = await this.usersService.findByTokenHash(tokenHash);
    
    if (!user || user.id !== payload.sub) {
      return null;
    }

    const { password, tokenHash: _, ...result } = user;
    return result;
  }
}