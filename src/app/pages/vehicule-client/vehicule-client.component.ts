import { Component,OnInit } from '@angular/core';
import { VehiculeService } from '../../services/vehicule.service';
import { CommonModule } from '@angular/common';
import { TypeVehiculeService } from '../../services/type-vehicule.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-vehicule-client',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './vehicule-client.component.html',
  styleUrl: './vehicule-client.component.css'
})
export class VehiculeClientComponent implements OnInit{
  vehicule: any[] = [];
  isListeLoading: boolean = false;
  typeVehicule: any[] = [];

  isInsertionLoading: boolean = false;
  isInsertionSubmit:boolean = false;

  insertionVehiculeForm : FormGroup;

  selectedUpdateVehicule : any;
  modificationVehiculeForm : FormGroup;
  isModificationLoading: boolean = false;
  isModificationSubmit:boolean = false;

  constructor(private vehiculeService: VehiculeService,private typeVehiculeService: TypeVehiculeService) {
    // insertion form
    this.insertionVehiculeForm = new FormGroup({
      immatriculation: new FormControl('', [Validators.required]),
      marque: new FormControl('', [Validators.required]),
      modele: new FormControl('', [Validators.required]),
      type_vehicule_id: new FormControl('', [Validators.required]),
    });

    // modification form
    // Formulaire de modification
    this.modificationVehiculeForm = new FormGroup({
      immatriculation: new FormControl('', [Validators.required]),
      marque: new FormControl('', [Validators.required]),
      modele: new FormControl('', [Validators.required]),
      type_vehicule_id: new FormControl('', [Validators.required]),
    });
  }

  loadVehicule() : void {
    this.isListeLoading = true;
    this.vehiculeService.getUserVehicule().subscribe({
      next: (data) => {
        this.vehicule = data;
        this.isListeLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des véhicules', err);
        this.isListeLoading = false;
      }
    });
  }

  loadTypeVehicule() : void {
    this.typeVehiculeService.getTypeVehicule().subscribe({
      next: (data) => {
        this.typeVehicule = data;
        // console.log(this.typeVehicule);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des types vehicule', err);
      }
    });
  }

  ngOnInit(): void {
    this.loadVehicule();
    this.loadTypeVehicule();
  }

  ajouterVehicule(){
    // console.log(JSON.stringify(this.insertionVehiculeForm.value));
    this.isInsertionSubmit = true;

    if(this.insertionVehiculeForm.invalid){
      return;
    }

    this.isInsertionLoading = true;

    this.vehiculeService.insererVehicule(this.insertionVehiculeForm.value).subscribe({
      next: (response) => {
        this.isInsertionLoading = false;
        this.loadVehicule();
        this.closeInsertionModal();
        alert("Vehicule inseré");
      },
      error: (error) => {
        this.isInsertionLoading = false;
        console.log(error);
      },
    });
  }

  closeInsertionModal() {
    const closeButton = document.getElementById('insertionModalClose');
    if (closeButton && closeButton instanceof HTMLButtonElement) {
      closeButton.click();
    }
  }

  onInsertionModalClose(){
    this.isInsertionSubmit = false;
    this.insertionVehiculeForm.reset();
  }

  // -----------  modifier ------------
  openModificationModal(vh : any){
    this.selectedUpdateVehicule = {...vh};

    this.modificationVehiculeForm.patchValue({
      immatriculation: vh.immatriculation,
      marque: vh.marque,
      modele: vh.modele,
      type_vehicule_id: vh.type_vehicule_id._id
    });
  }

  modifierVehicule(){
      this.isModificationSubmit = true;
      if(this.modificationVehiculeForm.invalid){
        return;
      }
  
      this.isModificationLoading = false;
      this.vehiculeService.modifierVehicule(this.selectedUpdateVehicule._id,this.modificationVehiculeForm.value).subscribe({
        next: (response) => {
          this.isModificationLoading = false;
          this.loadVehicule();
          this.closeModificationModal();
          alert("Vehicule modifie");
        },
        error: (error) => {
          this.isModificationLoading = false;
          console.log(error);
        },
      });
  }

  closeModificationModal() {
    const closeButton = document.getElementById('modificationModalClose');
    if (closeButton && closeButton instanceof HTMLButtonElement) {
      closeButton.click();
    }
  }
}
