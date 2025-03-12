import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout-main',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './layout-main.component.html',
  styleUrl: './layout-main.component.css'
})
export class LayoutMainComponent {
  isExpanded = false;

  changeClass() {
    this.isExpanded = !this.isExpanded;
  }
}
