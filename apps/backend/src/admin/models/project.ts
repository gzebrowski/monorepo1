import { ActionType, BaseAdminModel, ValidationError, validateEmail } from '@simpleblog/shared/admin';


export class ProjectAdmin extends BaseAdminModel {
    override prismaModel = 'Project';
    protected override listDisplayFields: string[] = ['pk', 'name', 'isActive', 'startFrom', 'validTo', 'status'];
    static override prismaModelName = 'Project';
    protected override searchFields: string[] = ['#pk', 'name'];
    protected override actions: ActionType[] = [
        { key: 'deleteSelected', label: 'Delete Selected', requiresConfirmation: true, confirmationMessage: 'Are you sure you want to delete the selected projects?' },
    ];

}
