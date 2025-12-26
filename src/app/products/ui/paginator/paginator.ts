import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
  @Input() page = 1;
  @Input() total = 0;
  @Input() pageSize = 24;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages() {
    return Math.ceil(this.total / this.pageSize);
  }

  get start(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  get end(): number {
    return Math.min(this.page * this.pageSize, this.total);
  }

  prevPage() {
    if (this.page > 1) {
      this.pageChange.emit(this.page - 1);
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.pageChange.emit(this.page + 1);
    }
  }
}
