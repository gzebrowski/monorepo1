import * as fs from 'fs';
import * as path from 'path';
import slugify from 'slugify';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);

export interface FileUploadResult {
  fileKey: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export class FileUploadHelper {
  private uploadDir: string;
  private baseUrl: string;

  constructor(uploadDir: string, baseUrl: string) {
    this.uploadDir = uploadDir;
    this.baseUrl = baseUrl;
  }

  /**
   * Process and save file to disk
   * @param file File object from multipart form
   * @param extraPath Optional extra path (e.g., model name like 'users', 'posts')
   * @returns File key (relative path)
   */
  async processFile(
    file: File | Express.Multer.File,
    extraPath?: string,
  ): Promise<string> {
    if (!file) {
      throw new Error('No file provided');
    }

    // Get file properties - handle both File and Express.Multer.File
    const fileName = 'name' in file ? file.name : file.originalname;
    const fileBuffer = await this.getFileBuffer(file);

    // Extract file extension
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);

    // Slugify the filename
    const slugifiedName = slugify(nameWithoutExt, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });

    // Generate unique filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const uniqueFileName = `${slugifiedName}-${timestamp}${ext}`;

    // Create model-specific directory path
    const modelDir = path.join(this.uploadDir, extraPath || '');
    const fileKey = path.join(extraPath || '', uniqueFileName);
    const fullPath = path.join(this.uploadDir, fileKey);

    // Ensure directory exists
    await this.ensureDirectoryExists(modelDir);

    // Write file to disk
    await writeFile(fullPath, fileBuffer);

    // Return relative path as file key
    return fileKey;
  }

  /**
   * Get file URL from file key
   * @param fileKey File key (relative path)
   * @param model Model name
   * @param idItem Optional item ID
   * @returns Full URL to access the file
   */
  getFileUrl(
    fileKey: string | null,
  ): string | null {
    if (!fileKey) {
      return null;
    }

    // Normalize path separators for URL
    const normalizedKey = fileKey.replace(/\\/g, '/');
    
    // Return URL that will be served by static file middleware
    return `${this.baseUrl}/uploads/${normalizedKey}`;
  }

  /**
   * Delete file from disk
   * @param fileKey File key (relative path)
   */
  async deleteFile(fileKey: string): Promise<void> {
    if (!fileKey) {
      return;
    }

    const fullPath = path.join(this.uploadDir, fileKey);

    try {
      await access(fullPath, fs.constants.F_OK);
      await promisify(fs.unlink)(fullPath);
    } catch (error) {
      // File doesn't exist or can't be deleted - ignore
      console.warn(`Could not delete file: ${fullPath}`, error);
    }
  }

  /**
   * Ensure directory exists, create if it doesn't
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await access(dirPath, fs.constants.F_OK);
    } catch {
      // Directory doesn't exist, create it recursively
      await mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Get buffer from file object
   */
  private async getFileBuffer(file: File | Express.Multer.File): Promise<Buffer> {
    if ('buffer' in file) {
      // Express.Multer.File
      return file.buffer;
    } else if ('arrayBuffer' in file) {
      // Web File API
      const arrayBuffer = await file.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } else {
      throw new Error('Unsupported file type');
    }
  }

  /**
   * Initialize upload directory
   */
  async initialize(): Promise<void> {
    await this.ensureDirectoryExists(this.uploadDir);
  }
}

/**
 * Create FileUploadHelper instance with configuration
 */
export function createFileUploadHelper(
  uploadDir?: string,
  baseUrl?: string,
): FileUploadHelper {
  const dir = uploadDir || process.env.UPLOAD_DIR || 'uploads';
  const url = baseUrl || process.env.NX_PUBLIC_API_URL || 'http://localhost:3001';
  
  return new FileUploadHelper(dir, url);
}
