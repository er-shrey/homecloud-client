import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-rename-folder',
  imports: [FormsModule],
  templateUrl: './rename-folder.component.html',
  styleUrl: './rename-folder.component.scss',
})
export class RenameFOlderComponent {
  @Input({ required: true }) currentFolderName: string = '';
  @ViewChild('content') content!: TemplateRef<any>;
  @Output() folderRenamed = new EventEmitter<string>();
  folderName: string = '';

  constructor(private modalService: NgbModal) {}

  open() {
    this.modalService.open(this.content);
  }

  onRenamed() {
    if (this.folderName) {
      this.folderRenamed.emit(this.folderName);
      this.modalService.dismissAll();
      this.folderName = '';
    }
  }

  closeModal() {
    this.modalService.dismissAll();
    this.folderName = '';
  }
}
