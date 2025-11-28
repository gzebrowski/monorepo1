import { ActionType, BaseAdminModel } from '@prisma-admin/core';


export class VariousFieldsAdmin extends BaseAdminModel {
    override prismaModel = 'VariousFields';
    protected override listDisplayFields: string[] = ['id', 'intField', 'floatField', 'booleanField', 'dateTimeField', 'dateField', 'keyField'];
    static override prismaModelName = 'VariousFields';
    protected override searchFields: string[] = ['&id'];
    protected override actions: ActionType[] = [
        { key: 'deleteSelected', label: 'Delete Selected', requiresConfirmation: true, confirmationMessage: 'Are you sure you want to delete the selected users?' },
    ];
    protected override widgets: Record<string, string> = {
        stringField: 'image',
    };

}
