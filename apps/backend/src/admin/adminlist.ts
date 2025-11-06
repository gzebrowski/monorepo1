import { UserAdmin } from "./user";
import { AdminDefinitionMap } from "@simpleblog/shared/src/admin/baseAdmin";

const adminDefinitions: AdminDefinitionMap = {
  user: {cls: UserAdmin, name: UserAdmin.getPrismaModelPlural()},
};
export default adminDefinitions;
export {
  UserAdmin,
};
