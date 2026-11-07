import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, type JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PlatformController } from './platform.controller';
import { PlatformAuthGuard } from './platform.guard';
import { PlatformService } from './platform.service';
import { PlatformJwtStrategy } from './platform.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        ({
          secret: config.getOrThrow<string>('JWT_SECRET'),
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') ?? '12h' },
        }) as JwtModuleOptions,
    }),
  ],
  controllers: [PlatformController],
  providers: [PlatformService, PlatformJwtStrategy, PlatformAuthGuard],
  exports: [PlatformService],
})
export class PlatformModule {}
