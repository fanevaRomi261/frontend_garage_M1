import { Component , OnInit ,signal, ChangeDetectorRef , NgZone} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { Service } from '../../model/Service.model';
import { ServiceService } from '../../services/service.service';
import { FormGroup, FormControl , ReactiveFormsModule } from '@angular/forms';
import { PlanningService } from '../../services/planning.service';
import { Time } from '../../model/time.model';


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
  creneau: Time[] = []; // Utiliser any[] ou une interface appropriée pour vos créneaux
  isCreneauShowed : boolean = false;
  formulaire: FormGroup;
  serviceChoisi : string = "";
  calendarVisible = signal(true);
  
  
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
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    themeSystem: 'bootstrap5',
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef , private serviceServices: ServiceService , private planningService : PlanningService) {
    this.formulaire = new FormGroup({
      'service' : new FormControl(''),
      'heure_rdv' : new FormControl('')
    });
  }

  ngOnInit() : void{
    this.fetchServices();
  }

  submitCreneau(formValue: any) : void{
    let date = "";
    
    if(this.dateRendezVous?.toDateString() != null){
      date = this.dateRendezVous.toDateString();
    }
  
    const service = formValue.service;  
    this.fetchCreneauLibre(date,service);
  }

  fetchCreneauLibre(date: string, service: string):void{ 
    console.log("fetch creneau is called");

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


  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;

    console.log("before : " + this.dateRendezVous);
    this.dateRendezVous = selectInfo.start;
    console.log("after : " + this.dateRendezVous);
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }



}
