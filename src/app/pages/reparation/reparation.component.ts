import { Component } from '@angular/core';
import { ReparationService } from '../../services/reparation.service';
import { OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EtatLibellePipe } from '../../pipe/etat-libelle.pipe';
import { RendezvousService } from '../../services/rendezvous.service';

@Component({
  selector: 'app-reparation',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule ,EtatLibellePipe,RouterLink],
  templateUrl: './reparation.component.html',
  styleUrl: './reparation.component.css',
})
export class ReparationComponent {
  formulaireCompteRendu: FormGroup;
  isCompteRenduShowed: boolean = false;
  reparationId: string | null = null;

  infoReparation!: any;
  infoRendezVous!:any;

  userRole!: string;

  constructor(private reparationService: ReparationService,private route: ActivatedRoute,private rendezVousService : RendezvousService,private router: Router) {
    this.formulaireCompteRendu = new FormGroup({
      compte_rendu: new FormControl(''),
      prix_main_doeuvre: new FormControl(),
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.reparationId = params.get('id'); // Récupération de l'ID depuis l'URL
      if (this.reparationId) {
        this.loadInformationReparation(this.reparationId);
        this.loadUserRoleAndPermissions()
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
    this.reparationService.getReparationById(idReparation).subscribe({
      next: (reparation) => {
        this.infoReparation = reparation;
        console.log("Réparation récupérée :", this.infoReparation); 
        if (reparation.rendez_vous_id) {
          this.rendezVousService.getRendezVousById(reparation.rendez_vous_id).subscribe({
            next: (rendezVous) => {
              this.infoRendezVous = rendezVous;
              console.log("Rendez-vous récupéré :", this.infoRendezVous); 
            },
            error: (error) => {
              console.error("Erreur lors de la récupération du rendez-vous :", error);
            }
          });
        }
      },
      error: (error) => {
        console.error("Erreur lors de la récupération de la réparation :", error);
      }
    });
  }

  showFormulaireCompteRendu(): void {
    this.isCompteRenduShowed = true;
  }

  submitCompteRendu(): void {
    const date_fin = this.reparationService.formatDate(new Date());
    const { compte_rendu, prix_main_doeuvre } = this.formulaireCompteRendu.value;
    const reparation_id = this.infoReparation._id;
    const rendez_vous_id = this.infoRendezVous._id;

    this.reparationService.terminerReparation(reparation_id,rendez_vous_id,date_fin,compte_rendu,prix_main_doeuvre).subscribe(
      (response) =>{
        alert("Réparation fermée");
        this.router.navigate(['/agenda-mecanicien']);
    },(error) => {
      console.error(error);
    })
  }

  paiementReparation() : void{
    const rendez_vous_id = this.infoRendezVous._id;

    this.reparationService.payerReparation(rendez_vous_id).subscribe(
      (response) => {
        alert("Réparation payée");
        this.router.navigate(['/accueil']);
      },(error) => {
        console.error(error);
      })
  }


}
