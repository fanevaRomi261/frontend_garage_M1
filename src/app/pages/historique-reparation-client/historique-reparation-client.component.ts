import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ReparationService } from '../../services/reparation.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historique-reparation-client',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './historique-reparation-client.component.html',
  styleUrl: './historique-reparation-client.component.css',
})
export class HistoriqueReparationClientComponent implements OnInit {
  vehicule_id: string | null = null;
  historique_reparation: any[] = [];

  ngOnInit(): void {
    this.vehicule_id = this.route.snapshot.paramMap.get('vehicule_id');
    this.loadHistorique(this.vehicule_id);
  }

  constructor(
    private route: ActivatedRoute,
    private reparationService: ReparationService
  ) {}

  loadHistorique(vehicule_id: string | null): void {
    if (vehicule_id) {
      this.reparationService.getReparationsByVehiculeId(vehicule_id).subscribe({
        next: (data) => {
          this.historique_reparation = data;
          console.log(this.historique_reparation);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des historiques', err);
        },
      });
    }
  }
}
