import { ApiClient } from '../../api/client';
import { 
    CommonReturnModelItemType,
    ExistingFormData, 
    NewFormData, 
    CommonPostResult, 
    ActionIdsType, 
    GetModelsType,
    GetModelItemsType
} from '@simpleblog/shared/admin';
import { AutoCompleteOption } from '../../components/ui';


export type UserData = {
	id: string;
	name: string;
	email: string;
};

export class AdminService {
    private apiService: ApiClient;

    constructor() {

        this.apiService = new ApiClient('/api/admin/');
    }
    async getAllModels() {
        return await this.apiService.get<GetModelsType>('models');
    }
    async getModelItems(model: string, page: number = 0, filters: Record<string, any> = {}) {
        const result = await this.apiService.get<GetModelItemsType>(`items/${model}`, {
            p: page,
            ...filters,
        });
        return result;
        // console.log(result.data);
    }
    async getModelItem(model: string, idItem: string, extraApiParams?: Record<string, any>) {
        return await this.apiService.get<CommonReturnModelItemType>(`items/${model}/${idItem}`, extraApiParams);
    }
    async performAction(model: string, action: string, idList: ActionIdsType) {
        return await this.apiService.post<any, {ids: ActionIdsType}>(`items/${model}/actions/${action}`, {
            ids: idList,
        });
    }
    async updateModelItem(model: string, idItem: string, data: Record<string, any>) {
        return await this.apiService.put<CommonPostResult, Record<string, any>>(`items/${model}/${idItem}`, data);
    }
    async saveInlines(model: string, idItem: string, existingItems: Record<string, ExistingFormData[]>, newItems: Record<string, NewFormData[]>) {
        return await this.apiService.put<CommonPostResult, Record<string, any>>(`inlines/${model}/${idItem}`, { existingItems, newItems });
    }

    async getModelMetadata(model: string, extraApiParams?: Record<string, any>) {
        return await this.apiService.get<CommonReturnModelItemType>(`models/${model}`, extraApiParams);
    }
    async createModelItem(model: string, data: Record<string, any>) {
        return await this.apiService.post<CommonPostResult, Record<string, any>>(`items/${model}`, data);
    }
    async getAutocompleteOptions(model: string, targetModel: string, keyField: string, query: string, depData: Record<string, any>) {
        return await this.apiService.post<AutoCompleteOption[], any>(`autocomplete/${model}`, { keyField, query, targetModel, depData });
    }
    async deleteObject(model: string, idItem: string) {
        return await this.apiService.delete<any>(`items/${model}/${idItem}`);
    }
    async getModelItemIdByUniqueField(newModel: string, relationField: string, itemId: string) {
        return await this.apiService.get<string>(`get-id-by-unique/${newModel}`, {
            params: {
                field: relationField,
                value: itemId,
            },
        });
    }
}
