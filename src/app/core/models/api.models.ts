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
