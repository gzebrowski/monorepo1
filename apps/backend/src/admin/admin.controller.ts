import { BaseAdminController, PrismaService } from '@prisma-admin/nestjs';
import { AdminService } from './admin.service';


export class AdminController extends BaseAdminController<AdminService> {
    getAdminServiceInstance(prisma: PrismaService) {
        return new AdminService(prisma);
    }
}
