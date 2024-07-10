import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [AuthModule, UserModule, PermissionModule, RoleModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
