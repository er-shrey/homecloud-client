export interface IFileUploadProgress {
  totalFiles: number;
  currentFileNumber: number;
  progress: number;
  uploadingStatus: UploadingStatus;
}

export enum UploadingStatus {
  UPLOADING = 'Uploading',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  IDLE = 'Idle',
}
