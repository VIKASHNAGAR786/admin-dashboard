import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnChanges {
  @Input() isOpen = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      // Force change detection when isOpen input changes
      this.cdr.markForCheck();
    }
  }

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
