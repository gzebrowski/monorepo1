import { ActionType, BaseAdminModel, ValidationError } from '@simpleblog/shared/src/admin/baseAdmin';
import { validateEmail } from '@simpleblog/shared/src/admin';


export class UserAdmin extends BaseAdminModel {
    override prismaModel = 'User';
    protected override listDisplayFields: string[] = ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt', 'updatedAt', 'createdAt'];
    static override prismaModelName = 'User';
    protected override searchFields: string[] = ['#id', 'firstName', 'lastName', 'email'];
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
}
