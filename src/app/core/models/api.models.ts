export interface IFolderData {
  path: string;
  items: IFolderItem[];
}

export interface IFolderItem {
  name: string;
  type: string;
  size: number;
  lastModified: string;
  thumbnail: string;
}

export interface ICreateFolderResponse {
  status: string;
  message: string;
  folderPath: string;
}

export interface IRenameFolderResponse {
  status: string;
  message: string;
  oldFolderPath: string;
  newFolderPath: string;
}

export interface IFileUploadResponse {
  success: boolean;
  message: string;
  file: string;
  path: string;
  thumbnail: string;
}
