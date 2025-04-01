import { Component } from '@angular/core';
import { ReparationService } from '../../services/reparation.service';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EtatLibellePipe } from '../../pipe/etat-libelle.pipe';
import { RendezvousService } from '../../services/rendezvous.service';
import { PieceService } from '../../services/piece.service';
import { StockService } from '../../services/stock.service';

@Component({
  selector: 'app-reparation',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EtatLibellePipe, RouterLink],
  templateUrl: './reparation.component.html',
  styleUrl: './reparation.component.css',
})
export class ReparationComponent {
  formulaireCompteRendu: FormGroup;
  isCompteRenduShowed: boolean = false;
  reparationId: string | null = null;

  infoReparation!: any;
  infoRendezVous!: any;

  userRole!: string;

  isListeLoading: boolean = false;

  //insertion
  listePiece: any[] = [];
  formDetailReparation: FormGroup;

  isInsertFormSubmitted: boolean = false;
  isInsertFormLoading: boolean = false;

  errorMessage: string | null = null;

  constructor(
    private reparationService: ReparationService,
    private route: ActivatedRoute,
    private rendezVousService: RendezvousService,
    private router: Router,
    private pieceService: PieceService,
    private stockService: StockService
  ) {
    this.formulaireCompteRendu = new FormGroup({
      compte_rendu: new FormControl(''),
      prix_main_doeuvre: new FormControl(),
    });

    this.formDetailReparation = new FormGroup({
      piece_id: new FormControl('', [Validators.required]),
      quantite: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(1),
      ]),
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.reparationId = params.get('id'); // Récupération de l'ID depuis l'URL
      if (this.reparationId) {
        this.loadInformationReparation(this.reparationId);
        this.loadUserRoleAndPermissions();
        this.loadPiece();
      }
    });
  }

  loadUserRoleAndPermissions(): void {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const infoUser = JSON.parse(userData);
      this.userRole = infoUser.profil_id.libelle.toLowerCase();
    }
  }

  loadInformationReparation(idReparation: string): void {
    this.isListeLoading = true;
    this.reparationService.getReparationById(idReparation).subscribe({
      next: (reparation) => {
        this.infoReparation = reparation;
        this.isListeLoading = false;
        console.log('Réparation récupérée :', this.infoReparation);
        if (reparation.rendez_vous_id) {
          this.rendezVousService
            .getRendezVousById(reparation.rendez_vous_id)
            .subscribe({
              next: (rendezVous) => {
                this.infoRendezVous = rendezVous;
                console.log('Rendez-vous récupéré :', this.infoRendezVous);
              },
              error: (error) => {
                console.error(
                  'Erreur lors de la récupération du rendez-vous :',
                  error
                );
              },
            });
        }
      },
      error: (error) => {
        this.isListeLoading = false;
        console.error(
          'Erreur lors de la récupération de la réparation :',
          error
        );
      },
    });
  }

  showFormulaireCompteRendu(): void {
    this.isCompteRenduShowed = true;
  }

  submitCompteRendu(): void {
    const date_fin = this.reparationService.formatDate(new Date());
    const { compte_rendu, prix_main_doeuvre } =
      this.formulaireCompteRendu.value;
    const reparation_id = this.infoReparation._id;
    const rendez_vous_id = this.infoRendezVous._id;

    this.reparationService
      .terminerReparation(
        reparation_id,
        rendez_vous_id,
        date_fin,
        compte_rendu,
        prix_main_doeuvre
      )
      .subscribe(
        (response) => {
          alert('Réparation fermée');
          this.router.navigate(['/agenda-mecanicien']);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  paiementReparation(): void {
    const rendez_vous_id = this.infoRendezVous._id;

    this.reparationService.payerReparation(rendez_vous_id).subscribe(
      (response) => {
        alert('Réparation payée');
        this.router.navigate(['/accueil']);
      },
      (error) => {
        console.error(error);
      }
    );
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
      reparation_id: this.reparationId, // Ajoute reparation_id
    };

    console.log(detailRaparationData);
    this.stockService.insererDetailReparation(detailRaparationData).subscribe({
      next: (response) => {
        if (this.reparationId) {
          this.isInsertFormLoading = false;
          this.closeInsertionModal();

          this.loadInformationReparation(this.reparationId);
          this.formDetailReparation.reset();
          alert('Detail inseré');
        }
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
