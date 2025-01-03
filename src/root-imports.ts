import { ConfigModule, ConfigService } from "@nestjs/config";
import config from './config/config';
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./admin/authentication/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

export const rootImports = [
    ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
        load: [config]
    }),
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            secret: configService.get('jwt.secret'),
            signOptions: { expiresIn: '1h' }
        }),
        global: true,
        inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            uri: configService.get('database.connectionString'),
        }),
        inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'uploads'),
        serveRoot: '/uploads',
    }),
    AuthModule
]