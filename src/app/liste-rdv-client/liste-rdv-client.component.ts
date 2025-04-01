import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RendezvousService } from '../services/rendezvous.service';
import { EtatLibellePipe } from '../pipe/etat-libelle.pipe';
import { Router } from '@angular/router';
@Component({
  selector: 'app-liste-rdv-client',
  standalone: true,
  imports: [CommonModule,EtatLibellePipe],
  templateUrl: './liste-rdv-client.component.html',
  styleUrl: './liste-rdv-client.component.css'
})
export class ListeRdvClientComponent implements OnInit{
  mes_rdv : any[] = [];
  isListeLoading: boolean = false;

  rdvIdToCancel : string | null = null;
  errorMessage : string | null = null;

  constructor(private rendezVousService : RendezvousService , private router : Router){}

  ngOnInit(): void {
    this.loadMesRdv();  
  }

  loadMesRdv() : void{
    this.isListeLoading = true;
    this.rendezVousService.getRdvByIdClient().subscribe({
      next: (data) => {
        this.mes_rdv = data;
        this.isListeLoading = false;
        console.log(data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des rdv', err);
        this.isListeLoading = false;
      }
    });
  }

  getTimeFormatted(time : any) : string {
    const format = (num: number) => num.toString().padStart(2, '0');
    return `${format(time.hours)}:${format(time.minutes)}`;
  }

  annulerRdv() : void {
    if (this.rdvIdToCancel) {
      this.rendezVousService
        .annulerRdv(this.rdvIdToCancel)
        .subscribe({
          next: (response) => {
            this.loadMesRdv();
            alert('Rendez-vous annulé');
            this.closeModal('confirmationModalClose');
          },
          error: (error) => {
            console.log(error);
            this.errorMessage = error.error.message;
          },
        });
    }
  }

  setIdRdvToCancel(rdv_id : string | null) : void {
    this.rdvIdToCancel = rdv_id;
  }

  closeModal(id_close_button : string) {
    const closeButton = document.getElementById(id_close_button);
    if (closeButton && closeButton instanceof HTMLButtonElement) {
      closeButton.click();
    }
  }

  onConfirmationModalClose() {
    this.errorMessage = null;
  }

  consulterReparation(rdv_id : string) : void{
    this.rendezVousService.getReparationForRendezVous(rdv_id).subscribe(
      (response) => {
        this.router.navigate(['/reparation',response._id]);
    }, (error) => {
      console.error(error);
    });
  }

}
