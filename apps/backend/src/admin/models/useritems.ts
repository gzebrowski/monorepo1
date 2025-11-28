import { ActionType, BaseAdminModel } from '@prisma-admin/core';


export class UserItemsAdmin extends BaseAdminModel {
    override prismaModel = 'UserItems';
    protected override listDisplayFields: string[] = ['id', 'itemName', 'image', 'customFile', 'activeTo'];
    static override prismaModelName = 'UserItems';
    protected override searchFields: string[] = ['&id'];
    protected override actions: ActionType[] = [
        { key: 'deleteSelected', label: 'Delete Selected', requiresConfirmation: true, confirmationMessage: 'Are you sure you want to delete the selected user items?' },
    ];
    protected override widgets: Record<string, string> = {
        image: 'image',
        customFile: 'file',
        activeTo: 'date',
    };

}
