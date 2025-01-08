import { ConfigModule, ConfigService } from "@nestjs/config";
import config from './config/config';
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "./api/authentication/auth.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { MasterModule } from "./api/master/master.module";
import { WorkModule } from "./api/works/work.module";

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
            dbName: configService.get('database.dbName'),
        }),
        inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'uploads'),
        serveRoot: '/uploads',
    }),
    AuthModule,
    MasterModule,
    WorkModule
]