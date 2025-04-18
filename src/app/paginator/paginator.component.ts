import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';  

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent {
  @Input() page = 1;
  @Input() pageSize = 20;
  @Input() totalPages = 1;
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() goToPage = new EventEmitter<number>();

  pages(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}