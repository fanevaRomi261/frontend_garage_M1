import { Component, OnInit } from '@angular/core';
import { VehiculeService } from '../../services/vehicule.service';
import { CommonModule } from '@angular/common';
import { TypeVehiculeService } from '../../services/type-vehicule.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UtilisateurService } from '../../services/utilisateur.service';

@Component({
  selector: 'app-gestion-mecanicien',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-mecanicien.component.html',
  styleUrl: './gestion-mecanicien.component.css',
})
export class GestionMecanicienComponent implements OnInit {
  mecanicien: any[] = [];
  isListeLoading: boolean = false;

  isInsertionLoading: boolean = false;
  isInsertionSubmit: boolean = false;

  insertionMecanicienForm: FormGroup;

  selectedUpdateMecanicien: any;
  modificationMecanicienForm: FormGroup;
  isModificationLoading: boolean = false;
  isModificationSubmit: boolean = false;

  errorMessageInsertion: string | null = null;

  userIdToDelete: string | null = null;

  constructor(private utilisateurService: UtilisateurService) {
    // insertion form
    this.insertionMecanicienForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^\+33[1-9](\d{2}){4}$/) // Validation pour un numéro français
      ]),
      dtn: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/), // Format date YYYY-MM-DD
      ]),
    });

    // modification form
    // Formulaire de modification
    this.modificationMecanicienForm = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required, Validators.email]),
      contact: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^\+33[1-9](\d{2}){4}$/) // Validation pour un numéro français
      ]),
      dtn: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/), // Format date YYYY-MM-DD
      ]),
      isActif: new FormControl(false)
    });
  }

  loadMecanicien(): void {
    this.isListeLoading = true;
    this.utilisateurService.getListeMecanicien().subscribe({
      next: (data) => {
        // console.log(data);
        this.mecanicien = data;
        this.isListeLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des mecaniciens', err);
        this.isListeLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadMecanicien();
  }

  ajouterMecanicien() {
    this.isInsertionSubmit = true;

    if (this.insertionMecanicienForm.invalid) {
      return;
    }

    this.isInsertionLoading = true;

    this.utilisateurService
      .ajoutMecanicien(this.insertionMecanicienForm.value)
      .subscribe({
        next: (response) => {
          this.isInsertionLoading = false;
          this.loadMecanicien();
          this.closeModal('insertionModalClose');
          alert('Mecanicien inseré');
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
    this.insertionMecanicienForm.reset();
  }

  // -----------  modifier ------------
  openModificationModal(vh: any) {
    this.selectedUpdateMecanicien = { ...vh };

    this.modificationMecanicienForm.patchValue({
      nom: vh.nom,
      prenom: vh.prenom,
      mail: vh.mail,
      contact: vh.contact,
      dtn: new Date(vh.dtn).toISOString().split('T')[0],
      isActif: vh.isActif === 1
    });

    if (vh.isActif === 1) {
      this.modificationMecanicienForm.get('isActif')?.disable();
    } else {
      this.modificationMecanicienForm.get('isActif')?.enable();
    }
  }

 
  modifierMecanicien() {
    this.isModificationSubmit = true;
    if (this.modificationMecanicienForm.invalid) {
      return;
    }

    this.isModificationLoading = false;
    this.utilisateurService.modifierMecanicien(this.selectedUpdateMecanicien._id,this.modificationMecanicienForm.value).subscribe({
      next: (response) => {
        this.isModificationLoading = false;
        this.loadMecanicien();
        alert("Vehicule modifie");
        this.closeModal('modificationModalClose');
      },
      error: (error) => {
        this.isModificationLoading = false;
        console.log(error);
      },
    });
  }

  // desactiver mecanicien
  desactiverMecanicien() {
    console.log("eto");
    if (this.userIdToDelete) {
      this.utilisateurService
        .desactiverUtilisateur(this.userIdToDelete)
        .subscribe({
          next: (response) => {
            this.loadMecanicien();
            alert('Mécanicien desactivé');
            this.closeModal('confirmationModalClose');
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }

  setUserIdToDelete(id: string | null) {
    this.userIdToDelete = id;
  }

  closeModal(id_close_button : string) {
    const closeButton = document.getElementById(id_close_button);
    if (closeButton && closeButton instanceof HTMLButtonElement) {
      closeButton.click();
    }
  }
}
