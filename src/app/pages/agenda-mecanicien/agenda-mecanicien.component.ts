import { Component, signal } from '@angular/core';
import { CalendarOptions, EventApi } from 'fullcalendar';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS } from '../planning/event-utils';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormGroup, FormControl , ReactiveFormsModule } from '@angular/forms';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FullCalendarModule } from '@fullcalendar/angular';


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

  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin
    ],
    headerToolbar: {
      left: '',
      center: 'title',
      right: 'prev,next',
    },
    initialView: 'timeGridWeek',
    initialEvents : this.event,
    allDaySlot: false,
    slotMinTime: '07:00',
    slotMaxTime : '19:00',
    editable : this.canEditPlanning,
    themeSystem : 'bootstrap5',
    selectMirror : true,
    dayMaxEvents : true,
    
  });

  currentEvents = signal<EventApi[]>([]);

  constructor(){

  }




}
