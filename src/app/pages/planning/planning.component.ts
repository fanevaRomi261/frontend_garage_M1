import { Component , OnInit ,signal, ChangeDetectorRef , NgZone} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { VehiculeService } from '../../services/vehicule.service';
import { ServiceService } from '../../services/service.service';
import { FormGroup, FormControl , ReactiveFormsModule } from '@angular/forms';
import { PlanningService } from '../../services/planning.service';
import { Time } from '../../model/time.model';
import { Vehicule } from '../../model/vehicule.model';
import { RendezvousService } from '../../services/rendezvous.service';
import { Service } from '../../model/service.model';

@Component({
  selector: 'app-planning',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule , ReactiveFormsModule],
  templateUrl: './planning.component.html',
  styleUrl: './planning.component.css'
})

export class PlanningComponent {
  dateRendezVous:Date | null = null;
  services: Service[] = [];
  vehiculeUtilisateur: Vehicule[] = [];
  creneau: Time[] = []; 

  isCreneauShowed : boolean = false;
  canChangeDate : boolean = true;

  formulaireCreneau: FormGroup;
  calendarVisible = signal(true);
  selectedDate: Date | null = null;

  formulaireRendezvous : FormGroup;

  serviceCreneauChoisi!:Service ;
  vehiculeCreneauChoisi!:Vehicule ;

  choixUtilisateur : boolean = false;


  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next',
      // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, 
    weekends: true,
    editable: true,
    selectable: true,
    themeSystem: 'bootstrap5',
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    // eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private vehiculeService: VehiculeService , private rendezvousServices : RendezvousService ,private serviceServices: ServiceService , private planningService : PlanningService , private router: Router) {
    this.formulaireCreneau = new FormGroup({
      'serviceCreneau' : new FormControl(''),
      'vehiculeCreneau' : new FormControl(''),
    });

    this.formulaireRendezvous = new FormGroup({
      'heure_rdv' :  new FormControl('')
    });
  }

  ngOnInit() : void{
    this.fetchServices();
    this.loadVehicule();
  }


  loadVehicule() : void {
    this.vehiculeService.getUserVehiculeByIsma().subscribe(
      (data: Vehicule[]) => {
        this.vehiculeUtilisateur = data;
      },
      (error) => {
        console.error("Error fetching vehicule : " , error)
      }
    );
  }


  submitCreneau(formValue: any) : void{
    let date = "";
    
    console.log('Formulaire soumis :', formValue);

    if(this.dateRendezVous?.toDateString() != null){
      date = this.dateRendezVous.toDateString();
    }

    const dateUtc = this.rendezvousServices.convertIsoStringDateWithoutUTC(date);

    this.vehiculeService.getVehiculeByIdVehiculeByIsma(formValue.vehiculeCreneau).subscribe({
      next: (data) =>{
        this.vehiculeCreneauChoisi = data;
      },
      error: (err) => console.error('Erreur lors de la recherche de vehicule : ' + err),
    });

    this.serviceServices.findServiceById(formValue.serviceCreneau).subscribe({
      next: (data) => {
        this.serviceCreneauChoisi = data; 
      },
      error: (err) => console.error('Erreur lors de la recherche du service :', err),
    });

    const service = formValue.serviceCreneau;

    console.log("service choisi : " + service);
    console.log();
  
    this.fetchCreneauLibre(dateUtc,service);
    this.canChangeDate = false;
    this.choixUtilisateur = true;
  }



  submitRendezVous(formValue : any) : void{
    const date_rdv = this.dateRendezVous?.toISOString() || new Date().toISOString();

    // Convertir date_rdv en YYYY-MM-DDT00:00:00.000Z
    const dateUtc = this.rendezvousServices.convertIsoStringDateWithoutUTC(date_rdv);

    const heure_rdv = formValue.heure_rdv;
    const service = this.serviceCreneauChoisi._id;
    const voiture = this.vehiculeCreneauChoisi._id; 
    
    const creneau = this.planningService.convertStringToIntervalle(heure_rdv);
    this.rendezvousServices.saveRendezVous(dateUtc.toString(),creneau,service,voiture).subscribe({
      next: (response) =>{
        alert("Votre rendez vous a été enregistré");
        this.router.navigate(['/liste-rdv-client']);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  handleRetour() : void {
    this.choixUtilisateur = false;
    this.canChangeDate = true;
    this.serviceCreneauChoisi = {} as Service;
    this.vehiculeCreneauChoisi = {} as Vehicule;
  }

  fetchCreneauLibre(date: string, service: string):void{ 
    this.planningService.getCreneauPropose(service, date).subscribe(
      (data: Time[][]) => { 
        this.creneau = data.flat();
        this.isCreneauShowed = true;
      },
      (error) => {
        console.error("Error fecthing creneau : ", error);
      }
    );
  }

  fetchServices() : void{
    this.serviceServices.getServices().subscribe(
      (data: Service[]) => {
        this.services = data;
      },
      (error) => {
        console.error("Error fetching service : " , error)
      }
    );
  }


  // ## calendrier

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;

    if(this.canChangeDate === false){
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = selectInfo.start;
    selectedDate.setHours(0, 0, 0, 0); 
    

    if (selectedDate < today) {
      alert("Impossible de sélectionner une date passée !");
      calendarApi.unselect();
      return;
    }
    
    this.dateRendezVous = selectInfo.start;

    if (this.selectedDate) {
      this.resetDateBackground(this.selectedDate);
    }

    this.selectedDate = selectInfo.start;
    this.highlightDate(selectInfo.start);
    calendarApi.unselect(); 
  }
  

  formatDateToLocal(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois (0-indexé)
    const day = date.getDate().toString().padStart(2, '0'); // Jour
    return `${year}-${month}-${day}`;
  }

  highlightDate(date: Date) {
    const dateString = this.formatDateToLocal(date);
    const cell = document.querySelector(`[data-date="${dateString}"]`);
    if (cell) {
      (cell as HTMLElement).style.backgroundColor = 'lightblue';
    }
  }

  resetDateBackground(date: Date) {
    const dateString = this.formatDateToLocal(date);
    const cell = document.querySelector(`[data-date="${dateString}"]`);
    if (cell) {
      (cell as HTMLElement).style.backgroundColor = ''; // Réinitialise à la couleur par défaut
    }
  }

  // handleEvents(events: EventApi[]) {
  //   this.currentEvents.set(events);
  //   this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  // }



}
