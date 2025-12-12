import * as fs from 'fs';
import * as path from 'path';

/**
 * Utility functions for directory management
 */
export class DirectoryUtils {
  /**
   * Ensure directory exists, create if it doesn't
   */
  static ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`📁 Created directory: ${dirPath}`);
    }
  }
  
  /**
   * Get test results directory (main directory that won't be overwritten)
   */
  static getTestResultsDir(): string {
    return path.join(process.cwd(), 'test-results');
  }
  
  /**
   * Get screenshots directory (persistent, won't be overwritten)
   */
  static getScreenshotsDir(): string {
    return path.join(this.getTestResultsDir(), 'screenshots');
  }
  
  /**
   * Get videos directory
   */
  static getVideosDir(): string {
    return path.join(this.getTestResultsDir(), 'videos');
  }
  
  /**
   * Get traces directory
   */
  static getTracesDir(): string {
    return path.join(this.getTestResultsDir(), 'traces');
  }
  
  /**
   * Get HTML report directory
   */
  static getHtmlReportDir(): string {
    return path.join(this.getTestResultsDir(), 'html-report');
  }
  
  /**
   * Get Playwright output directory (will be overwritten)
   */
  static getPlaywrightOutputDir(): string {
    return path.join(this.getTestResultsDir(), 'playwright-output');
  }
  
  /**
   * Setup all test result directories
   */
  static setupTestResultDirectories(): void {
    const dirs = [
      this.getTestResultsDir(),
      this.getScreenshotsDir(),
      this.getVideosDir(),
      this.getTracesDir(),
      this.getHtmlReportDir(),
      this.getPlaywrightOutputDir()
    ];
    
    dirs.forEach(dir => this.ensureDirectoryExists(dir));
  }
  
  /**
   * List files in directory
   */
  static listFiles(dirPath: string): string[] {
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    
    try {
      return fs.readdirSync(dirPath);
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
      return [];
    }
  }
  
  /**
   * Get file size in bytes
   */
  static getFileSize(filePath: string): number {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch (error) {
      console.error(`Error getting file size for ${filePath}:`, error);
      return 0;
    }
  }
  
  /**
   * Get screenshot count
   */
  static getScreenshotCount(): number {
    const screenshotsDir = this.getScreenshotsDir();
    if (!fs.existsSync(screenshotsDir)) {
      return 0;
    }
    
    try {
      const files = fs.readdirSync(screenshotsDir);
      return files.filter(file => file.endsWith('.png')).length;
    } catch (error) {
      console.error('Error counting screenshots:', error);
      return 0;
    }
  }
  
  /**
   * List all screenshots
   */
  static listScreenshots(): string[] {
    const screenshotsDir = this.getScreenshotsDir();
    if (!fs.existsSync(screenshotsDir)) {
      return [];
    }
    
    try {
      const files = fs.readdirSync(screenshotsDir);
      return files.filter(file => file.endsWith('.png')).sort();
    } catch (error) {
      console.error('Error listing screenshots:', error);
      return [];
    }
  }
  
  /**
   * Clean up old screenshots automatically
   */
  static cleanupScreenshots(): void {
    const screenshotsDir = this.getScreenshotsDir();
    
    if (!fs.existsSync(screenshotsDir)) {
      return;
    }
    
    try {
      const files = fs.readdirSync(screenshotsDir)
        .filter(file => file.endsWith('.png'))
        .map(file => ({
          name: file,
          path: path.join(screenshotsDir, file),
          stats: fs.statSync(path.join(screenshotsDir, file))
        }))
        .sort((a, b) => b.stats.mtime.getTime() - a.stats.mtime.getTime()); // newest first
      
      const now = Date.now();
      const maxAgeMs = 24 * 60 * 60 * 1000; // 24 hours
      const maxCount = 50; // keep only 50 newest files
      
      let deletedCount = 0;
      
      // Delete by age (older than 24 hours)
      const oldFiles = files.filter(file => (now - file.stats.mtime.getTime()) > maxAgeMs);
      oldFiles.forEach(file => {
        fs.unlinkSync(file.path);
        deletedCount++;
      });
      
      // Delete by count (keep only the newest ones)
      const remainingFiles = files.filter(file => (now - file.stats.mtime.getTime()) <= maxAgeMs);
      if (remainingFiles.length > maxCount) {
        const filesToDelete = remainingFiles.slice(maxCount);
        filesToDelete.forEach(file => {
          fs.unlinkSync(file.path);
          deletedCount++;
        });
      }
      
      if (deletedCount > 0) {
        console.log(`🧹 Cleaned up ${deletedCount} old screenshots`);
      }
      
    } catch (error) {
      console.error('Error during screenshot cleanup:', error);
    }
  }
}
