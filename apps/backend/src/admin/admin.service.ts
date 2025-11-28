import adminDefinitions from './adminlist';
import { AdminDefinitionMap } from "@prisma-admin/core";
import { BaseAdminService } from "@prisma-admin/nestjs";
import { PrismaService } from '../prisma/prisma.service';
import { createFileUploadHelper, FileUploadHelper } from '../common/utils/file-upload.helper';

class AdminService extends BaseAdminService {
    private fileUploadHelper: FileUploadHelper;

    constructor(prisma: PrismaService) {
        super(prisma);
        // Initialize file upload helper
        this.fileUploadHelper = createFileUploadHelper();
        
        // Ensure upload directory exists on service initialization
        this.fileUploadHelper.initialize().catch(err => {
            console.error('Failed to initialize upload directory:', err);
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
            const fileKey = await this.fileUploadHelper.processFile(file, model, id);
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
    getFileUrl(fileKey: string, model: string, idItem?: string | number | null): string | null {
        return this.fileUploadHelper.getFileUrl(fileKey, model, idItem);
    }

    /**
     * Delete file from disk (optional - can be called when deleting records)
     * @param fileKey File key to delete
     */
    async deleteFile(fileKey: string): Promise<void> {
        await this.fileUploadHelper.deleteFile(fileKey);
    }
}

export { AdminService };
