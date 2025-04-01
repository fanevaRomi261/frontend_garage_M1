import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilisateurService } from '../../services/utilisateur.service';
import { PieceService } from '../../services/piece.service';
import { TypeVehiculeService } from '../../services/type-vehicule.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-piece',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './gestion-piece.component.html',
  styleUrl: './gestion-piece.component.css'
})
export class GestionPieceComponent implements OnInit{
  piece: any[] = [];
  isListeLoading: boolean = false;

  type_vehicule: any[] = [];

  // insert
  isInsertionLoading: boolean = false;
  isInsertionSubmit: boolean = false;
  errorMessageInsertion: string | null = null;

  newPiece = {
    libelle: '',
    prix: '',
    type_vehicule_id: [] as any[]
  };


  // modif
  isModificationLoading: boolean = false;
  isModificationSubmit: boolean = false;
  errorMessageModification: string | null = null;

  selectedPiece = {
    _id: '',
    libelle: '',
    prix: '',
    type_vehicule_id: [] as string[]
  };

  constructor(private pieceService : PieceService,private typeVehiculeService : TypeVehiculeService) {
    
  }


  loadListeTypeVehicule(): void {
    this.typeVehiculeService.getTypeVehicule().subscribe({
      next: (data) => {
        // console.log(data);
        this.type_vehicule = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du liste type vehicule', err);
      },
    });
  }

  loadListePiece(): void {
    this.isListeLoading = true;
    this.pieceService.getListePiece().subscribe({
      next: (data) => {
        // console.log(data);
        this.piece = data;
        this.isListeLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des pieces', err);
        this.isListeLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadListeTypeVehicule();
    this.loadListePiece();
  }

  ajouterPiece() {

    this.isInsertionSubmit = true;
    console.log(this.newPiece);
    if (this.newPiece.type_vehicule_id.length === 0) {
      // this.errorMessageInsertion = "Veuillez sélectionner au moins un type de véhicule.";
      return;
    }

    this.isInsertionLoading = true;


    this.pieceService
      .insererPiece(this.newPiece)
      .subscribe({
        next: (response) => {
          this.isInsertionLoading = false;
          this.loadListePiece();
          this.closeModal('insertionModalClose');
          alert('Pièce inserée');
        },
        error: (error) => {
          this.isInsertionLoading = false;
          this.errorMessageInsertion = error.error.message;
          console.log(error);
        },
      });
  }

  onInsertionModalClose() {
    this.isInsertionSubmit = false;
    this.resetNewPiece();
  }

  resetNewPiece() {
    this.newPiece = {
      libelle: '',
      prix: '',
      type_vehicule_id: []
    };
  }

  onInsertTypeVehiculeChange(event: Event, id: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.newPiece.type_vehicule_id.includes(id)) {
        this.newPiece.type_vehicule_id.push(id);
      }
    } else {
      this.newPiece.type_vehicule_id = this.newPiece.type_vehicule_id.filter(
        (typeId) => typeId !== id
      );
    }
  }

  // -----------  modifier ------------
  openModificationModal(piece: any) {
    this.selectedPiece = {
      ...piece,
      type_vehicule_id: piece.type_vehicule_id.map((type: { _id: string }) => type._id) // Déclaration explicite
    };
    // console.log('selectedPiece:', this.selectedPiece);
    this.isModificationSubmit = false;
    this.errorMessageModification = null;
  }
  
 
  modifierPiece() {

    // console.log(this.selectedPiece);
    const pieceToSend = {
      libelle: this.selectedPiece.libelle,
      prix: this.selectedPiece.prix,
      type_vehicule_id: this.selectedPiece.type_vehicule_id
    };

    this.isModificationSubmit = true;
    // console.log(this.selectedPiece);
    if (this.selectedPiece.type_vehicule_id.length === 0) {
      // this.errorMessageInsertion = "Veuillez sélectionner au moins un type de véhicule.";
      return;
    }

    this.isModificationLoading = true;


    this.pieceService
      .modifierPiece(this.selectedPiece._id,pieceToSend)
      .subscribe({
        next: (response) => {
          this.isModificationLoading = false;
        this.loadListePiece();
        alert("Pièce modifiée");
        this.closeModal('modificationModalClose');
        },
        error: (error) => {
          this.isModificationLoading = false;
          this.errorMessageModification = error.error.message;
          console.log(error);
        },
      });
  }


  closeModal(id_close_button : string) {
    const closeButton = document.getElementById(id_close_button);
    if (closeButton && closeButton instanceof HTMLButtonElement) {
      closeButton.click();
    }
  }

  onModifyTypeVehiculeChange(event: Event, id : string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.selectedPiece.type_vehicule_id.includes(id)) {
        this.selectedPiece.type_vehicule_id.push(id);
      }
    } else {
      this.selectedPiece.type_vehicule_id = this.selectedPiece.type_vehicule_id.filter(
        (typeId) => typeId !== id
      );
    }
  }

}
