import { Permission } from 'src/permission/entity/permission.entity';
import { Role } from 'src/role/entity/role.entity';
import { User } from 'src/user/entity/user.entity';
import { DataSource } from 'typeorm';

export async function seedData(dataSource: DataSource): Promise<void> {
  const permissionRepo = dataSource.getRepository(Permission);
  const roleRepo = dataSource.getRepository(Role);
  const userRepo = dataSource.getRepository(User);
  
  

}
