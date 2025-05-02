import { Component } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { NavigationService } from '../../core/services/navigation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(
    private apiService: ApiService,
    private navigationService: NavigationService
  ) {}

  createFolder() {
    // TODO: Implement folder creation logic
    console.log('Create folder clicked');
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
}
