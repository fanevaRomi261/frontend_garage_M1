import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-etat-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './etat-stock.component.html',
  styleUrl: './etat-stock.component.css',
})
export class EtatStockComponent implements OnInit {
  etatStock: any[] = [];
  isListeLoading: boolean = false;

  ngOnInit(): void {
    this.loadEtatStock();
  }

  constructor(private stockService: StockService) {}

  loadEtatStock(): void {
    this.isListeLoading = true;
    this.stockService.getEtatStock().subscribe({
      next: (data) => {
        this.etatStock = data;
        this.isListeLoading = false;
      },
      error: (err) => {
        this.isListeLoading = false;
        console.error('Erreur lors de la récupération de l etat de stock', err);
      },
    });
  }
}
