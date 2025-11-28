import { ActionType, BaseAdminModel, FieldDefinition, InlineDefinition, ValidationError, validateEmail } from '@prisma-admin/core';

const inlines: InlineDefinition[] = [
    {
        model: 'VariousFields',
        label: 'Various Fields',
        mode: 'inline',
        expanded: true,
    },
    {
        model: 'UserItems',
        label: 'User Items',
        mode: 'inline',
        expanded: true,
        excludeFields: ['createdAt'],
    },
];


export class UserAdmin extends BaseAdminModel {
    override prismaModel = 'User';
    protected override listDisplayFields: string[] = ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt'];
    static override prismaModelName = 'User';
    protected override listFilterFields: string[] = ['isActive'];
    protected override inlines: InlineDefinition[] = inlines;
    protected override searchFields: string[] = ['&id', 'firstName', 'lastName', 'email'];
    protected override widgets: Record<string, string> = {
        avatar: 'image',
    };
    protected override actions: ActionType[] = [
        { key: 'deleteSelected', label: 'Delete Selected', requiresConfirmation: true, confirmationMessage: 'Are you sure you want to delete the selected users?' },
    ];

    async validate_email(value: string, id?: string) {
        value = value?.trim().toLowerCase();
        if (!validateEmail(value)) {
            throw new ValidationError('Invalid email format');
        }
        return value;
    }
    public override async getLabelFromObject(object: Record<string, any>): Promise<string> {
        return ['firstName', 'lastName'].map(field => object?.[field]).filter(Boolean).join(' ') || object?.['email'];
        // return (object?.['name'] || object?.['title'] || object?.['label'] || this.getObjectPk(object) || '<unnamed>').toString();
    }
    public override async preProcessFiles(pk: string | number | null, data: Record<string, any>, filesData: Record<string, File> | null): Promise<Record<string, any> | null | undefined> {
        // Handle file uploads here if necessary
        console.log('PreProcessFiles called for UserAdmin with pk:', pk, 'data:', data, 'filesData:', filesData);
        return {};
    }
}
