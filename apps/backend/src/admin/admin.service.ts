import adminDefinitions from './adminlist';
import { AdminDefinitionMap } from "@prisma-admin/core";
import { BaseAdminService } from "@prisma-admin/nestjs";
import { PrismaService } from '../prisma/prisma.service';
import { LocalFileStorage } from '@prisma-admin/node-utils';


class AdminService extends BaseAdminService {
    private fileStorage: LocalFileStorage;

    constructor(prisma: PrismaService) {
        super(prisma);
        // Initialize file upload helper
        this.fileStorage = new LocalFileStorage(process.env.UPLOAD_DIR || 'uploads', process.env.BASE_URL || 'http://localhost:3001');
        
        // Ensure upload directory exists on service initialization
        this.fileStorage.initialize().catch(err => {
            console.error('Failed to initialize file storage:', err);
        });
    }

    getAdminDefinitions(): AdminDefinitionMap {
        return adminDefinitions as AdminDefinitionMap;
    }

    /**
     * Process uploaded file and save it to disk
     * @param model Model name (e.g., 'users', 'posts')
     * @param file File from multipart form upload
     * @param id Optional item ID for updates
     * @returns File key (relative path like "users/bardzo-piekny-obrazek-1234567890.jpg")
     */
    async processFile(model: string, file: File, id?: string | number | null): Promise<string | null> {
        if (!file) {
            return null;
        }

        try {
            const fileKey = await this.fileStorage.processFile(file, model);
            return fileKey;
        } catch (error) {
            console.error('Error processing file:', error);
            throw error;
        }
    }

    /**
     * Get public URL for uploaded file
     * @param fileKey File key returned by processFile (e.g., "users/bardzo-piekny-obrazek-1234567890.jpg")
     * @param model Model name
     * @param idItem Optional item ID
     * @returns Full URL to access the file (e.g., "http://localhost:3001/uploads/users/bardzo-piekny-obrazek-1234567890.jpg")
     */
    async processThumbnail(model: string, filePath: string, id?: string | number | null): Promise<string | null> {
        if (!filePath) {
            return null;
        }

        try {
            const fileKey = await this.fileStorage.createThumbnail(filePath, null, 150, 150);
            return fileKey;
        } catch (error) {
            console.error('Error processing file:', error);
            throw error;
        }
    }
    async getFileUrl(fileKey: string, model: string, idItem?: string | number | null): Promise<string | null> {
        return await this.fileStorage.getFileUrl(fileKey);
    }
    async getThumbnailUrl(fileKey: string, model: string, idItem?: string | number | null): Promise<string | null> {
        // Implement your logic to generate a thumbnail URL based on the file key, model, and item ID
        // For example, if using cloud storage, generate a signed URL for the thumbnail
        return await this.fileStorage.getThumbnailUrl(fileKey, 150, 150);
    }

    /**
     * Delete file from disk (optional - can be called when deleting records)
     * @param fileKey File key to delete
     */
    async deleteFile(fileKey: string): Promise<void> {
        await this.fileStorage.deleteFile(fileKey);
    }
}

export { AdminService };
