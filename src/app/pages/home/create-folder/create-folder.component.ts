import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class CreateFolderComponent {
  @ViewChild('content') content!: TemplateRef<any>;
  @Output() folderCreated = new EventEmitter<string>();
  folderName: string = '';

  constructor(private modalService: NgbModal) {}

  open() {
    this.modalService.open(this.content);
  }

  onCreate() {
    if (this.folderName) {
      this.folderCreated.emit(this.folderName);
      this.modalService.dismissAll();
      this.folderName = '';
    }
  }

  closeModal() {
    this.modalService.dismissAll();
    this.folderName = '';
  }
}
