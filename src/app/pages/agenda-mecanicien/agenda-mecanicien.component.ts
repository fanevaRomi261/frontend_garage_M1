import { Component, signal } from '@angular/core';
import { CalendarOptions, EventApi } from 'fullcalendar';
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


@Component({
  selector: 'app-agenda-mecanicien',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule , ReactiveFormsModule],
  templateUrl: './agenda-mecanicien.component.html',
  styleUrl: './agenda-mecanicien.component.css'
})
export class AgendaMecanicienComponent {

  event: any[] = [];
  canEditPlanning : boolean = true;
  showInfoRendezvous : boolean = false;
  infoRendezVous!: any;

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
    editable : this.canEditPlanning,
    themeSystem : 'bootstrap5',
    selectMirror : true,
    dayMaxEvents : true,
    eventClick : (info) => this.zoomEventView(info),
  });

  currentEvents = signal<EventApi[]>([]);

  constructor(private rendezVousService : RendezvousService , private router : Router ){

  }

  ngOnInit() : void{
   this.loadEventForMeca();
  
  }

  loadEventForMeca() : void{
    this.rendezVousService.getRendezVousMecanicienSemaine().subscribe(
      (data: any[]) => {
        this.event = this.rendezVousService.convertRdvMecanicienToEvent(data);

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

    const _idRendezVous = selectInfo.event._def.extendedProps._id;
    console.log(_idRendezVous); 

    this.rendezVousService.getRendezVousById(_idRendezVous).subscribe((result : any) => {
      this.infoRendezVous = result;
      console.log("info rendez vous : " + this.infoRendezVous.client_id.nom);
      this.showInfoRendezvous = true;
    } , (error) => {
      console.log("Erreur dans la récuparation des infos du rendez vous : " + error);
    });
  }

  commencerRendezVous() : void{
    this.router.navigate(['/reparation',this.infoRendezVous._id]);
  }


}
