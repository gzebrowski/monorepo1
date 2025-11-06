import {
    Controller,
    Get,
    Req,
    Post,
    Delete,
    Body,
    Param,
    Query,
    Put,
    Request,
} from '@nestjs/common';

import { AdminService } from './admin.service';
import { GetModelItemsType, ValidationError, ApiResponseError, CommonPostResult } from '@simpleblog/shared/admin';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin')
export class AdminController {
	constructor(private adminService: AdminService, private readonly prisma: PrismaService) {}

	getPostResult(@Request() req, data: any, error?: any): CommonPostResult {
        if (error) {
            if (Array.isArray(error)) {
                const errorMap: Record<string, ValidationError['errors'] | null> = {};
                error.forEach(err => {
                    if (err.model && err.errors?.length) {
                        errorMap[err.model] = err.errors;
                    }
                });
                if (Object.keys(errorMap).length > 0) {
                    return {
                        status: 'error',
                        message: 'Validation errors occurred',
                        errors: null,
                        errorMap,
                        data: null
                    };
                }
            }
            if (error instanceof ValidationError) {
                return {
                    status: 'error',
                    message: error.message,
                    errors: error.errors,
                    data: null
                }
            }
            if (error instanceof ApiResponseError) {
                return {
                    status: 'error',
                    message: error.message,
                    errors: null,
                    data: null
                };
            }
            throw error;
        } else {
            return {
                status: 'success',
                message: 'Operation successful',
                errors: null,
                data
            }
        }
    }

    @Get('models')
	getModels() {
		return this.adminService.getModels();
	}

    @Get('models/:model')
	getModelMetadata(@Request() req, @Param('model') model: string, @Query() params: Record<string, any> = {}) {
        return this.adminService.getModelMetadata(req, model, params);
	}

    @Get('items/:model')
    async getModelItems(@Request() req, @Param('model') model: string, @Query() filters: Record<string, any> = {}): Promise<GetModelItemsType> {
        try {
            const page = Math.max(0, parseInt(filters.p, 10) || 0);
            delete filters.p;
            const data = await this.adminService.getModelItems(req, model, page, filters);
            return data;
        }
        catch (error) {
            console.error('Error fetching model items:', error);
            throw error;
        }
    }

    @Post('items/:model/actions/:action')
    async performAction(
        @Request() req,
        @Param('model') model: string,
        @Param('action') action: string,
        @Body('ids') ids: string[]
    ) {
        const user = req.user;
        try {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                throw new Error('Invalid or empty ids array');
            }
            const result = await this.adminService.performAction(req, user, model, action, ids);
            return this.getPostResult(req, result);
        } catch (error) {
            console.error('Error performing action:', error);
            return this.getPostResult(req, null, error);
        }
    }

    @Get('items/:model/:idItem')
    async getModelItem(@Request() req, @Param('model') model: string, @Param('idItem') idItem: string, @Query() params: Record<string, any> = {}) {
        try {
            const data = await this.adminService.getModelItem(req, model, idItem, params);
            return data;
        } catch (error) {
            console.error('Error fetching model item:', error);
            throw error;
        }
    }

    @Post('items/:model')
    async createModelItem(@Request() req, @Param('model') model: string, @Body() itemData: Record<string, any>) {
        try {
            const data = await this.adminService.createModelItem(req, model, itemData);
            return this.getPostResult(req, data);
        } catch (error) {
            console.error('Error creating model item:', error);
            return this.getPostResult(req, null, error);
        }
    }

    @Put('items/:model/:idItem')
    async updateModelItem(@Request() req, @Param('model') model: string, @Param('idItem') idItem: string, @Body() itemData: Record<string, any>) {
        try {
            const data = await this.adminService.getModelItem(req, model, idItem);
            if (!data || !data.item || !data.item.id) {
                throw new Error(`Item with id ${idItem} not found in model ${model}`);
            }
            // Assuming the modelInstance has a method to update an item
            const updatedItem = await this.adminService.updateModelItem(req, model, idItem, itemData);
            return this.getPostResult(req, updatedItem);
        } catch (error) {
            console.error('Error updating model item:', error);
            return this.getPostResult(req, null, error);
        }
    }

    @Put('inlines/:model/:idItem')
    async saveInlines(
        @Request() req,
        @Param('model') model: string,
        @Param('idItem') idItem: string,
        @Body() {existingItems, newItems}: {existingItems: Record<string, any>, newItems: Record<string, any>}
    ) {
        try {
            const data = await this.adminService.getModelItem(req, model, idItem);
            if (!data || !data.item || !data.item.id) {
                throw new Error(`Item with id ${idItem} not found in model ${model}`);
            }
            // Assuming the modelInstance has a method to update an item
            const updatedItem = await this.adminService.saveInlines(req, model, idItem, existingItems, newItems);
            return this.getPostResult(req, updatedItem);
        } catch (error) {
            console.error('Error updating model item:', error);
            return this.getPostResult(req, null, error);
        }
    }

    @Post('items/:model/:idItem/delete')
    async deleteModelItem(@Request() req, @Param('model') model: string, @Param('idItem') idItem: string) {
        try {
            const data = await this.adminService.getModelItems(req, model, 0, { id: idItem });
            if (data.items.length === 0) {
                throw new Error(`Item with id ${idItem} not found in model ${model}`);
            }
            const modelInstance = data.items[0];
            // Assuming the modelInstance has a method to delete an item
            await modelInstance.delete(idItem);
            return { success: true };
        } catch (error) {
            console.error('Error deleting model item:', error);
            throw error;
        }
    }

    @Post('autocomplete/:model')
    async getAutocompleteOptions(
        @Request() req,
        @Param('model') model: string,
        @Body() { targetModel, depData, keyField, query }: { targetModel: string, depData: Record<string, any>, keyField: string, query: string }
    ) {
        try {
            const data = await this.adminService.getAutocompleteItems(req, model, targetModel, keyField, query, depData);
            return data;
        } catch (error) {
            console.error('Error deleting model item:', error);
            throw error;
        }
    }
    @Delete('items/:model/:idItem')
    async deleteObject(@Request() req, @Param('model') model: string, @Param('idItem') idItem: string) {
        try {
            const data = await this.adminService.getModelItem(req, model, idItem);
            if (!data || !data.item || !data.item.id) {
                throw new Error(`Item with id ${idItem} not found in model ${model}`);
            }
            await this.adminService.deleteObject(req, model, idItem);
            return { success: true };
        } catch (error) {
            console.error('Error deleting model item:', error);
            throw error;
        }
    }
    @Get('get-id-by-unique/:model')
    async getIdByUniqueField(@Request() req, @Param('model') model: string, @Query() query: { field: string, value: string }) {
        try {
            const id = await this.adminService.getModelItemIdByUniqueField(model, query.field, query.value);
            return { id };
        } catch (error) {
            console.error('Error getting model item ID by unique field:', error);
            throw error;
        }
    }

}
