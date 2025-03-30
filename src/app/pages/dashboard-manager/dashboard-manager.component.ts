import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardManagerService } from '../../services/dashboard-manager.service';
import Chart from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-manager.component.html',
  styleUrl: './dashboard-manager.component.css',
})
export class DashboardManagerComponent implements OnInit {
  availableYears: number[] = [2023, 2024, 2025];
  monthsNames: string[] = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Jui',
    'Juil',
    'Aoû',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
  ];

  // userCount
  userCount: any;

  // graphe nb repa
  reparationCountChart: any;
  selectedYearReparationCount: number = 2025;

  // top selling piece
  topSellingPieces: any[] = [];

  // top client
  topClient: any[] = [];

  // temps moyen reparation
  tempsMoyenReparation: any;

  // depense moyenne par reparation
  depenseMoyenneReparation: any;

  // graphe chiffre d'affaire par mois
  chiffreChart: any;
  selectedYearChiffre: number = 2025;

  constructor(private dashboardManagerService: DashboardManagerService) {}

  ngOnInit(): void {
    this.loadUserCount();
    this.createReparationChart();
    this.loadTopSellingPiece();
    this.loadTopClient();
    this.loadTempsMoyenReparation();
    this.loadDepenseMoyenneReparation();
    this.createChiffreAffaireChart();
  }

  // nombre utilisateur
  loadUserCount(): void {
    this.dashboardManagerService.getUserCount().subscribe({
      next: (data) => {
        // console.log(data);
        this.userCount = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des pieces', err);
      },
    });
  }

  // graphique nombre de reparation
  createReparationChart(): void {
    this.dashboardManagerService
      .getRepairsCountByMonth(this.selectedYearReparationCount)
      .subscribe({
        next: (data) => {
          // console.log(data);

          const reparations = data.repairsPerMonth.map(
            (item: any) => item.count
          );
          const months = data.repairsPerMonth.map(
            (item: any) => this.monthsNames[item.month - 1]
          );

          const maxCount = Math.max(...reparations);
          const maxScale = maxCount + 2;

          if (this.reparationCountChart) {
            this.reparationCountChart.data.labels = months;
            this.reparationCountChart.data.datasets[0].data = reparations;
            this.reparationCountChart.options.scales.y.max = maxScale;
            this.reparationCountChart.update();
          } else {
            this.reparationCountChart = new Chart('reparationChart', {
              type: 'bar',
              data: {
                labels: months,
                datasets: [
                  {
                    label: 'Réparations par mois',
                    data: reparations,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: maxScale,
                    ticks: {
                      stepSize: 1,
                    },
                  },
                },
              },
            });
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des réparations', err);
        },
      });
  }

  onYearChangeReparationChart(): void {
    this.createReparationChart();
  }

  // top selling piece
  loadTopSellingPiece(): void {
    this.dashboardManagerService.getTopSellingPiece().subscribe({
      next: (data) => {
        // console.log("et");
        this.topSellingPieces = data.topPieces;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tops pieces', err);
      },
    });
  }

  // top client
  loadTopClient(): void {
    this.dashboardManagerService.getTopClients().subscribe({
      next: (data) => {
        // console.log("et");
        this.topClient = data.data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tops clients', err);
      },
    });
  }

  // temps moyen reparation
  loadTempsMoyenReparation(): void {
    this.dashboardManagerService.getAverageRepairTime().subscribe({
      next: (data) => {
        // console.log("et");
        this.tempsMoyenReparation = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tops clients', err);
      },
    });
  }

  // depense moyenne par reparation
  loadDepenseMoyenneReparation(): void {
    this.dashboardManagerService.depenseMoyenneParReparation().subscribe({
      next: (data) => {
        // console.log("et");
        this.depenseMoyenneReparation = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des tops clients', err);
      },
    });
  }

  // graphique chiffe d'affaire
  createChiffreAffaireChart(): void {

    this.dashboardManagerService
      .getChiffreParMois(this.selectedYearChiffre)
      .subscribe({
        next: (data) => {
          console.log(data);

          const chiffre = data.revenuePerMonth.map(
            (item: any) => item.revenue
          );
          const months = data.revenuePerMonth.map(
            (item: any) => this.monthsNames[item.month - 1]
          );

          const maxCount = Math.max(...chiffre);
          const maxScale = maxCount + 100000;

          if (this.chiffreChart) {
            this.chiffreChart.data.labels = months;
            this.chiffreChart.data.datasets[0].data = chiffre;
            this.chiffreChart.options.scales.y.max = maxScale;
            this.chiffreChart.update();
          } else {
            this.chiffreChart = new Chart('chiffreChart', {
              type: 'bar',
              data: {
                labels: months,
                datasets: [
                  {
                    label: 'Chiffre d\'affaire par mois',
                    data: chiffre,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: maxScale,
                    ticks: {
                      stepSize: 100000,
                    },
                  },
                },
              },
            });
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des chiffre d\'affaire', err);
        },
      });
  }
  onYearChangeChiffreChart(): void {
    this.createChiffreAffaireChart();
  }

}
