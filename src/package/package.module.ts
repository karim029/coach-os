import { Module } from '@nestjs/common';
import { PackageService } from './package.service.js';
import { PackageController } from './package.controller.js';

@Module({
  providers: [PackageService],
  controllers: [PackageController]
})
export class PackageModule {}
