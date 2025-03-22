import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PieceService } from '../../services/piece.service';
import { StockService } from '../../services/stock.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-reparation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './detail-reparation.component.html',
  styleUrl: './detail-reparation.component.css',
})
export class DetailReparationComponent implements OnInit {
  listePiece: any[] = [];
  formDetailReparation: FormGroup;

  isInsertFormSubmitted: boolean = false;
  isInsertFormLoading: boolean = false;

  reparation_id: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private pieceService: PieceService,
    private stockService: StockService,
    private route: ActivatedRoute
  ) {
    this.formDetailReparation = new FormGroup({
      piece_id: new FormControl('', [Validators.required]),
      quantite: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(1),
      ]),
    });
  }

  ngOnInit(): void {
    this.reparation_id = this.route.snapshot.paramMap.get('reparation_id');
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

  insertionDetailReparation(): void {
    this.isInsertFormSubmitted = true;

    if (this.formDetailReparation.invalid) {
      return;
    }

    this.isInsertFormLoading = true;

    const detailRaparationData = {
      ...this.formDetailReparation.value, // Étend les valeurs du formulaire (piece_id, quantite)
      reparation_id: this.reparation_id, // Ajoute reparation_id
    };

    console.log(detailRaparationData);
    this.stockService.insererDetailReparation(detailRaparationData).subscribe({
      next: (response) => {
        this.isInsertFormLoading = false;
        this.closeInsertionModal();
        this.formDetailReparation.reset();
        alert('Detail inseré');
      },
      error: (error) => {
        this.isInsertFormLoading = false;
        this.isInsertFormLoading = false;
        if (error.status === 422) {
          this.errorMessage = error.error.message; // "Quantité insuffisante pour ce pièce"
          if (
            error.error.stockRestant !== undefined &&
            error.error.quantiteDemandee
          ) {
            this.errorMessage += ` (Stock restant : ${error.error.stockRestant}, Demandé : ${error.error.quantiteDemandee})`;
          }
        } else if (error.status === 404) {
          this.errorMessage = 'Réparation non trouvée';
        } else {
          this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
          console.log(error);
        }
      },
    });
  }

  closeInsertionModal() {
    const closeButton = document.getElementById('insertionModalClose');
    if (closeButton && closeButton instanceof HTMLButtonElement) {
      closeButton.click();
    }
  }

  onInsertionModalClose() {
    this.isInsertFormSubmitted = false;
    this.formDetailReparation.reset();
  }
}
