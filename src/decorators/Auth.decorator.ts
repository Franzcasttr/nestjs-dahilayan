import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { RolesGuard } from 'src/guards/role.guard';

export function Auth(...permissions: string[]) {
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(RolesGuard),
  );
}
