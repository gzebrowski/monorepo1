import { Injectable } from '@nestjs/common';
import {
    Request,
    ForbiddenException
} from '@nestjs/common';
import {
    AdminService as AdminLogicService,
    ExistingFormData, 
    NewFormData
} from '@simpleblog/shared/admin';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminDefinitionMap } from "@simpleblog/shared/admin";

@Injectable()
export class BaseAdminService {
    private adminLogicService: AdminLogicService;
    constructor(private prisma: PrismaService) {
        const adminDefinitions: AdminDefinitionMap = this.getAdminDefinitions();
        this.adminLogicService = new AdminLogicService(this.prisma, adminDefinitions);
    }

    checkPermissions(req: Request, user: any, action: string) {
        // Implement permission checks based on your application's requirements
        // if (!user || !user.isAdmin) {
        //     throw new ForbiddenException('You do not have permission to perform this action.');
        // }
        return true;
    }
    checkModelPermissions(req: Request, user: any, model: string, action: string) {
        // Implement permission checks based on your application's requirements
        // if (!user || !user.isAdmin) {
        //     throw new ForbiddenException('You do not have permission to perform this action on this model.');
        // }
        return true;
    }
    checkModelItemPermissions(req: Request, user: any, model: string, pk: string, action: string) {
        // Implement permission checks based on your application's requirements
        // if (!user || !user.isAdmin) {
        //     throw new ForbiddenException('You do not have permission to perform this action on this model.');
        // }
        return true;
    }
    getAdminDefinitions(): AdminDefinitionMap {
        throw new Error('Method not implemented.');
    }

    getModels(): Record<string, string> {
        return this.adminLogicService.getModels();
    }
    async getModelItems(req: Request, model: string, page: number, filters: Record<string, any> = {}): Promise<any> {
        // This method should interact with the BaseAdminModel to fetch items
        // For simplicity, we will just return a mock response here
        return await this.adminLogicService.getModelItems(req, model, page, filters);
    }
    async performAction(req: Request, user: any, model: string, action: string, ids: string[]) {
        try {
            if (!ids || !Array.isArray(ids) || ids.length === 0) {
                throw new Error('Invalid or empty ids array');
            }
            return await this.adminLogicService.performAction(req, user, model, action, ids);
        } catch (error) {
            console.error('Error performing action:', error);
            throw error;
        }
    }
    async getModelItem(req: Request, model: string, idItem: string, params: Record<string, any> = {}): Promise<any> {
        // This method should interact with the BaseAdminModel to fetch items
        // For simplicity, we will just return a mock response here
        return await this.adminLogicService.getModelItem(req, model, idItem, params);
    }
    async updateModelItem(req: Request, model: string, idItem: string, itemData: Record<string, any>) {
        try {
            return await this.adminLogicService.updateModelItem(req, model, idItem, itemData);
        } catch (error) {
            console.error('Error updating model item:', error);
            throw error;
        }
    }
    async saveInlines(req: Request, model: string, idItem: string, existingItems: Record<string, ExistingFormData[]>, newItems: Record<string, NewFormData[]>) {
        try {
            return await this.adminLogicService.saveInlines(req, model, idItem, existingItems, newItems);
        } catch (error) {
            console.error('Error saving inlines:', error);
            throw error;
        }
    }
    async createModelItem(req: Request, model: string, data: Record<string, any>) {
        try {
            return await this.adminLogicService.createModelItem(req, model, data);
        } catch (error) {
            console.error('Error creating model item:', error);
            throw error;
        }
    }
    async getModelMetadata(req: Request, model: string, params: Record<string, any> = {}): Promise<any> {
        // This method should interact with the BaseAdminModel to fetch metadata
        // For simplicity, we will just return a mock response here
        return await this.adminLogicService.getModelMetadata(req, model, params);
    }
    async getAutocompleteItems(req: Request, model: string, targetModel: string, keyField: string, query: string, depData: Record<string, any>) {
        // This method should interact with the BaseAdminModel to fetch metadata
        // For simplicity, we will just return a mock response here
        return await this.adminLogicService.getAutocompleteItems(req, model, targetModel, keyField, query, depData);
    }
    async deleteObject(req: Request, model: string, idItem: string) {
        try {
            return await this.adminLogicService.deleteObject(req, model, idItem);
        } catch (error) {
            console.error('Error deleting object:', error);
            throw error;
        }
    }
    async getModelItemIdByUniqueField(model: string, field: string, value: string) {
        try {
            return await this.adminLogicService.getModelItemIdByUniqueField(model, field, value);
        } catch (error) {
            console.error('Error getting model item ID by unique field:', error);
            throw error;
        }
    }
}
