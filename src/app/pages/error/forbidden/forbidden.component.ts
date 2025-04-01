import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css','../../../../assets/css/error-page.css']
})
export class ForbiddenComponent {

}
