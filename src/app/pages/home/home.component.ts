import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { NavigationService } from '../../core/services/navigation.service';
import { IFolderData, IFolderItem } from '../../core/models/api.models';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CreateFolderComponent } from './create-folder/create-folder.component';
import { FormsModule } from '@angular/forms';
import { RenameFOlderComponent } from './rename-folder/rename-folder.component';
import {
  IFileUploadProgress,
  UploadingStatus,
} from '../../core/models/app.models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgbDropdownModule,
    BreadcrumbComponent,
    CreateFolderComponent,
    RenameFOlderComponent,
    FormsModule,
    NgbProgressbarModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  @ViewChild(CreateFolderComponent)
  createFolderComponent!: CreateFolderComponent;
  @ViewChild(RenameFOlderComponent)
  renameFolderComponent!: RenameFOlderComponent;
  folderData!: IFolderData;
  currenItemDetails!: IFolderItem;
  currentPath: string = '/';
  UploadingStatus = UploadingStatus;

  fileUploadProgress: IFileUploadProgress = {
    totalFiles: 0,
    currentFileNumber: 0,
    progress: 0,
    uploadingStatus: UploadingStatus.IDLE,
  };

  constructor(
    private apiService: ApiService,
    private navigationService: NavigationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      if (params['path']) {
        this.currentPath = params['path'];
      }
    });
  }

  ngOnInit(): void {
    this.apiService.listFolderData(this.currentPath).subscribe((data) => {
      this.folderData = data;
      this.setRootPathDetails(data);
    });
  }

  logout() {
    this.apiService.logout();
  }

  goToSettings() {
    this.navigationService.goToSettings();
  }

  selectItem(item: IFolderItem) {
    this.currenItemDetails = item;
  }

  openItem(item: IFolderItem) {
    if (item.type === 'directory') {
      // Update current path by appending the directory name
      const newPath =
        this.currentPath === '/'
          ? `/${item.name}`
          : `${this.currentPath}/${item.name}`;
      this.currentPath = newPath;

      this.openFolder(newPath);
    } else {
      // TODO: Implement file opening logic
      console.log('Opening file:', item);
    }
  }

  openFolder(path: string) {
    this.currentPath = path;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { path: path },
    });

    // Navigate into the folder
    this.apiService.listFolderData(this.currentPath).subscribe((data) => {
      this.folderData = data;
      this.setRootPathDetails(data);
    });
  }

  setRootPathDetails(data: IFolderData) {
    this.currenItemDetails = {
      name: data.path,
      type: '',
      size: data.items.reduce((acc, item) => acc + item.size, 0),
      lastModified:
        data.items.length > 0
          ? data.items.reduce(
              (latest, item) =>
                new Date(item.lastModified) > new Date(latest)
                  ? item.lastModified
                  : latest,
              data.items[0].lastModified
            )
          : new Date().toISOString(),
      thumbnail: '/fallbacks/thumbnail/folder_thumbnail.png',
    };
  }

  createFolder() {
    this.createFolderComponent.open();
  }

  onFolderCreated(folderName: string) {
    this.apiService
      .createFolder(this.currentPath, folderName)
      .subscribe((data) => {
        const newFolder: IFolderItem = {
          name: folderName,
          type: 'directory',
          size: 0,
          lastModified: new Date().toISOString(),
          thumbnail: '/fallbacks/thumbnail/folder_thumbnail.png',
        };
        this.folderData.items.unshift(newFolder);
      });
  }

  renameFolder() {
    this.renameFolderComponent.open();
  }

  onFolderRenamed(newName: string) {
    this.apiService
      .renameFolder(
        this.currentPath + '/' + this.currenItemDetails.name,
        newName
      )
      .subscribe((data) => {
        // Update the folder name in folderData.items
        const folderToUpdate = this.folderData.items.find(
          (item) =>
            item.type === 'directory' &&
            item.name === this.currenItemDetails.name
        );
        if (folderToUpdate) {
          folderToUpdate.name = newName;
          this.currenItemDetails.name = newName;
        }
      });
  }

  downloadFile() {
    const downloadUrl =
      '/api/files' + this.folderData.path + '/' + this.currenItemDetails.name;

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = this.currenItemDetails.name; // Set the download filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  uploadFiles() {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true; // Allow multiple file selection

    // Add change event listener
    fileInput.addEventListener('change', (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        this.fileUploadProgress.uploadingStatus = UploadingStatus.UPLOADING;
        this.fileUploadProgress.totalFiles = files.length;
        this.fileUploadProgress.currentFileNumber = 0;
        this.fileUploadProgress.progress = 0;

        // Convert FileList to Array and upload files sequentially
        const fileArray = Array.from(files);
        this.uploadNextFile(fileArray, 0);
      }
    });

    // Trigger the file selection dialog
    fileInput.click();
  }

  private uploadNextFile(files: File[], index: number) {
    if (index >= files.length) {
      // All files have been uploaded
      this.fileUploadProgress.uploadingStatus = UploadingStatus.COMPLETED;
      setTimeout(() => {
        this.fileUploadProgress.uploadingStatus = UploadingStatus.IDLE;
        this.openFolder(this.currentPath);
      }, 5000);
      return;
    }

    const file = files[index];
    this.apiService.uploadFile(this.currentPath, file).subscribe({
      next: (response) => {
        // Update progress
        this.fileUploadProgress.currentFileNumber = index + 1;
        this.fileUploadProgress.progress = ((index + 1) / files.length) * 100;
        // Upload next file
        this.uploadNextFile(files, index + 1);
      },
      error: (error) => {
        console.error(`Error uploading ${file.name}:`, error);
        // Continue with next file even if there's an error
        this.uploadNextFile(files, index + 1);
      },
    });
  }
}
