import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RendezvousService } from '../services/rendezvous.service';

@Component({
  selector: 'app-liste-rdv-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-rdv-client.component.html',
  styleUrl: './liste-rdv-client.component.css'
})
export class ListeRdvClientComponent implements OnInit{
  mes_rdv : any[] = [];
  isListeLoading: boolean = false;

  rdvIdToCancel : string | null = null;
  errorMessage : string | null = null;

  constructor(private rendezVousService : RendezvousService){}

  ngOnInit(): void {
    this.loadMesRdv();  
  }

  loadMesRdv() : void{
    this.isListeLoading = true;
    this.rendezVousService.getRdvByIdClient().subscribe({
      next: (data) => {
        this.mes_rdv = data;
        this.isListeLoading = false;
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
}
