import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  imports: [CommonModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  @Input('path') set path(value: string) {
    this._path = value;
    this.breadcrumbItem = [
      'Home',
      ...value.split('/').filter((item) => item !== ''),
    ];
  }
  private _path: string = '';
  @Output() navigateTo = new EventEmitter<string>();

  breadcrumbItem: string[] = [];

  selectedBreadcrumb(index: number): void {
    let path = this.breadcrumbItem
      .slice(0, index + 1)
      .join('/')
      .replace('Home', '')
      .trim();
    console.log(path, this._path);
    if (path !== this._path) {
      this.navigateTo.emit(path);
    }
  }
}
