import adminDefinitions from './adminlist';
import { AdminDefinitionMap } from "@prisma-admin/core";

import { BaseAdminService } from "@prisma-admin/nestjs"

class AdminService extends BaseAdminService {
    getAdminDefinitions(): AdminDefinitionMap {
        return adminDefinitions as AdminDefinitionMap;
    }
}

export { AdminService };
