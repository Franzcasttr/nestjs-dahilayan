import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RolesGuard } from 'src/guards/role.guard';

export function Role(...permissions: string[]) {
  return applyDecorators(
    SetMetadata('roles', permissions),
    UseGuards(RolesGuard),
  );
}
