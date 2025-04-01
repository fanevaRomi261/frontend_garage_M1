import { Component, signal } from '@angular/core';
import { CalendarOptions, EventApi, EventDropArg } from 'fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormGroup, FormControl , ReactiveFormsModule } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FullCalendarModule } from '@fullcalendar/angular';
import { RendezvousService } from '../../services/rendezvous.service';
import { OnInit , inject } from '@angular/core';
import { PlanningService } from '../../services/planning.service';
import { switchMap } from 'rxjs';
import { ReparationService } from '../../services/reparation.service';


@Component({
  selector: 'app-agenda-mecanicien',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule , ReactiveFormsModule],
  templateUrl: './agenda-mecanicien.component.html',
  styleUrl: './agenda-mecanicien.component.css'
})
export class AgendaMecanicienComponent {

  event: any[] = [];
  
  canEditPlanning : boolean = false;
  showInfoRendezvous : boolean = false;
  showUpdateRendezvous : boolean = false;
    
  infoRendezVous!: any;
  infoUpdate! : any;
  ancienneDateHeureRendezVous!: string;
  nouvelleDateRendezVous!: string;
  nouvelleHeureRendezVous!:string;
  nouveauCreneau!: number[];

  userRole!: string;
  mecanicienPropose : any[] = [];
  mecanicienSelectionne : any;

  modifFormulaire: FormGroup;

  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin
    ],
    headerToolbar: {
      left: 'timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prev,next',
    },
    initialView: 'timeGridWeek',
    events : [],
    allDaySlot: false,
    slotMinTime: '08:00',
    slotMaxTime : '18:00',
    eventResizableFromStart: false,
    eventDurationEditable: false, 
    editable : this.canEditPlanning,
    themeSystem : 'bootstrap5',
    selectMirror : true,
    dayMaxEvents : true,
    eventClick : (info) => this.zoomEventView(info),
    eventDrop : (info) => this.handleEventUpdate(info),
    
  });

  currentEvents = signal<EventApi[]>([]);

  constructor(private rendezVousService : RendezvousService , private router : Router , private planningService : PlanningService , private reparationService : ReparationService){
    this.modifFormulaire = new FormGroup({
      'mecanicien' : new FormControl('')
    }); 
  }

  ngOnInit() : void{
    this.loadUserRoleAndPermissions();
    this.loadEventForEmploye();
  }

  loadUserRoleAndPermissions(): void {
    const userData = localStorage.getItem('userData');

    if (userData) {
      const infoUser = JSON.parse(userData);
      this.userRole = infoUser.profil_id.libelle.toLowerCase();
      this.canEditPlanning = (this.userRole === 'manager');  
      
      this.calendarOptions.update((options) => ({
        ...options,
        editable: this.canEditPlanning,
        eventDraggable : this.canEditPlanning,
      }));
    }

    this.loadEventForEmploye();
  }

  loadEventForEmploye() : void{
    this.rendezVousService.getRendezVousEmploye().subscribe(
      (data: any[]) => {

        if(this.userRole === 'mécanicien'){
          this.event = this.rendezVousService.convertRdvMecanicienToEvent(data);
        }else if(this.userRole === 'manager'){
          console.log(data);
          this.event = this.rendezVousService.convertRdvManagerToEvent(data);
        }

        this.calendarOptions.update((options) => ({
          ...options,
          events: this.event,
          eventDidMount: (info) => {
            info.el.style.cursor = 'pointer';
          },
        }));
      },
      (error) => {
        console.error("Erreur sur la récupération des rendez vous : " + error)
      }
    )
  }

  zoomEventView(selectInfo : any) : void{
    const calendarApi = selectInfo.view.calendar;
    calendarApi.changeView('timeGridDay',selectInfo.event.startStr);

    this.calendarOptions.update((options) => ({
      ...options,
      slotDuration: "00:10:00",
      snapDuration: "00:10:00", 
    }));

    const _idRendezVous = selectInfo.event._def.extendedProps._id;
    console.log(_idRendezVous); 

    this.rendezVousService.getRendezVousById(_idRendezVous).subscribe((result : any) => {
      this.infoRendezVous = result;
      this.showUpdateRendezvous = false;
      this.showInfoRendezvous = true;
    } , (error) => {
      console.log("Erreur dans la récuparation des infos du rendez vous : " + error);
    });
  }


  handleEventUpdate(info : any) : void{
    const updatedEvent = {
      id : info.event._def.extendedProps._id,
      start : info.event.startStr,
      end : info.event.endStr,
    };

    this.showInfoRendezvous = false;

    const newDateUtc = this.rendezVousService.convertIsoStringDateWithoutUTC(updatedEvent.start);
    const heure_debut = updatedEvent.start.split('T')[1].split('.')[0].split('+')[0].substring(0, 5);
    const heure_fin =  updatedEvent.end.split('T')[1].split('.')[0].split('+')[0].substring(0, 5);

    this.nouveauCreneau = this.planningService.convertStringToIntervalle(`${heure_debut}&${heure_fin}`);

    this.rendezVousService.getRendezVousById(updatedEvent.id).pipe(
      switchMap((result) => {
        this.infoUpdate = result;
        const ancienneMin =  result.heure_rdv.minutes? result.heure_rdv.minutes.toString() : '' ;
        
        this.ancienneDateHeureRendezVous = result.date_rdv.toString().split('T')[0] + " | " + result.heure_rdv.hours.toString() + "h" + ancienneMin;        
        this.nouvelleDateRendezVous = newDateUtc;
        this.nouvelleHeureRendezVous = heure_debut;
        
        return this.planningService.getMecanicienPropose(newDateUtc, this.infoUpdate._id, this.nouveauCreneau);
      })
    ).subscribe((result) => {
      this.mecanicienPropose = result;

    },(error) => {
      console.error("Erreur sur fetch info update : " + error.message);
    })

    this.showUpdateRendezvous = true;
  }


  commencerRendezVous() : void{
    const date_debut = this.reparationService.formatDate(new Date());
    const mecanicien_id = this.infoRendezVous?.mecanicien_id._id;
    const rendez_vous_id = this.infoRendezVous?._id;

    console.log("date debut : " + date_debut + " , " + "mecanicien : " + mecanicien_id + " , rendez vous : " + rendez_vous_id);

    this.reparationService.commencerReparation(mecanicien_id,rendez_vous_id,date_debut).subscribe({
      next: (response) =>{
        console.log(`response _id : ` + response._id);
        this.router.navigate(['/reparation',response._id]);
      },
      error: (error) =>{
        alert(error);
      }
    });
  }

  annulerModification() : void{
    window.location.reload();   
  }

  onMecanicienSelection() {
    this.mecanicienSelectionne = this.modifFormulaire.get('mecanicien')?.value;
    console.log('Mécanicien sélectionné:', this.mecanicienSelectionne);
  }

  validerModification() {
    if (this.mecanicienSelectionne) {
      const body = {
        "_id" : this.infoUpdate._id,
        "date_rdv" : this.nouvelleDateRendezVous,
        "heure_rdv" : this.nouveauCreneau,
        "mecanicien_id" : this.mecanicienSelectionne
      }

      this.rendezVousService.updateRendezVous(body).subscribe({
        next: (response) =>{
          alert("Rendez Vous modifié avec succés");
          this.showUpdateRendezvous = false;
          window.location.reload();
        },
        error: (error) =>{
          console.log(error);
          alert(error.message);
        }
      }) ;
      
    }else{
      console.log("veuillez choisir un mécanicien");
    }
  }

  consulterReparation(){
    this.rendezVousService.getReparationForRendezVous(this.infoRendezVous?._id).subscribe(
      (response) => {
        this.router.navigate(['/reparation',response._id]);
    }, (error) => {
      console.error(error);
    });
  }

}
