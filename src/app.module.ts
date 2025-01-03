import { Module } from '@nestjs/common';
import { rootImports } from './root-imports';

@Module({
  imports: rootImports,
  controllers: [],
  providers: [],
})
export class AppModule { }
