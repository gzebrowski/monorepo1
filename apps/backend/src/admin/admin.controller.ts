import { BaseAdminController } from '@prismaadmin/nestjs/admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '@prismaadmin/nestjs/prisma.service';


export class AdminController extends BaseAdminController<AdminService> {
    getAdminServiceInstance(prisma: PrismaService) {
        return new AdminService(prisma);
    }
}
