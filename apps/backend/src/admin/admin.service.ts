import adminDefinitions from './adminlist';
import { AdminDefinitionMap } from "@prismaadmin/core/baseAdmin";

import { BaseAdminService } from "@prismaadmin/nestjs/admin.service"

class AdminService extends BaseAdminService {
    getAdminDefinitions(): AdminDefinitionMap {
        return adminDefinitions as AdminDefinitionMap;
    }
}

export { AdminService };
