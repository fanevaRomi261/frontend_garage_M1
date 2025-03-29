import { Component } from '@angular/core';

@Component({
  selector: 'app-reparation',
  standalone: true,
  imports: [],
  templateUrl: './reparation.component.html',
  styleUrl: './reparation.component.css'
})
export class ReparationComponent {
  
  isCompteRenduShowed : boolean = false;
  
  constructor(){

  }


  showFormulaireCompteRendu(): void{
    this.isCompteRenduShowed = true;
  } 


}
