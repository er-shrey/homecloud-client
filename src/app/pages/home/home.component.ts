import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { NavigationService } from '../../core/services/navigation.service';
import { IFolderData, IFolderItem } from '../../core/models/api.models';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CreateFolderComponent } from './create-folder/create-folder.component';
import { FormsModule } from '@angular/forms';
import { RenameFOlderComponent } from './rename-folder/rename-folder.component';

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

  uploadFiles() {
    // TODO: Implement file upload logic
    console.log('Upload files clicked');
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
}
