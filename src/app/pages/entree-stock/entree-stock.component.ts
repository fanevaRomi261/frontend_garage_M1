import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PieceService } from '../../services/piece.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-entree-stock',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './entree-stock.component.html',
  styleUrl: './entree-stock.component.css',
})
export class EntreeStockComponent implements OnInit {
  listePiece: any[] = [];
  formEntree : FormGroup;

  isFormSubmitted : boolean = false;
  isFormLoading : boolean = false;

  constructor(private pieceService: PieceService,private stockService: StockService) {
    this.formEntree = new FormGroup({
      piece_id: new FormControl('', [Validators.required]),
      quantite: new FormControl('', [Validators.required,Validators.pattern('^[0-9]*$'),Validators.min(1)]),
      date_entree: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadPiece();
  }

  loadPiece(): void {
    this.pieceService.getListePiece().subscribe({
      next: (data) => {
        this.listePiece = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des pieces', err);
      },
    });
  }

  insererEntree() : void{
    this.isFormSubmitted = true;

    if(this.formEntree.invalid){
      return;
    }

    this.isFormLoading = true;

    this.stockService.insererEntreeStock(this.formEntree.value).subscribe({
      next: (response) => {
        this.isFormLoading = false;
        this.formEntree.reset();
        alert("Entrée inseré");
      },
      error: (error) => {
        this.isFormLoading = false;
        console.log(error);
      },
    });
  }
}
