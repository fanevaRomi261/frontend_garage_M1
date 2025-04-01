import { Component,OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProfilService } from '../../../services/profil.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule,CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent{
  
  registerModel = { nom: '', prenom: '' ,mail: '' ,pwd: '' ,dtn: '' ,contact: '' };
  errorMessage: string = '';
  loading = false;

  formUser : FormGroup;

  submitted = false;

  constructor(private authService: AuthService, private router: Router) {
    this.formUser = new FormGroup({
      nom: new FormControl('', [Validators.required]),
      prenom: new FormControl('', [Validators.required]),
      mail: new FormControl('', [Validators.required, Validators.email]),
      pwd: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        // Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]),
      contact: new FormControl('', [
        Validators.required,
        // Validators.pattern(/^\+33[1-9](\d{2}){4}$/) // Validation pour un numéro français
      ]),
      dtn: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/) // Format date YYYY-MM-DD
      ]),
    })
  }


  doRegister() {
    // console.log("ok");
    this.submitted = true;

    if (this.formUser.invalid) {
      // this.submitted = false;
      return;
    }

    this.loading = true;

    this.registerModel = {
      nom: this.formUser.value.nom,
      prenom: this.formUser.value.prenom,
      mail: this.formUser.value.mail,
      pwd: this.formUser.value.pwd,
      dtn: this.formUser.value.dtn,
      contact: this.formUser.value.contact,
    };


    this.authService.register(this.registerModel).subscribe({
      next: (response) => {
        this.loading = false;
        alert("Inscription validée, veuillez vous reconnecter");
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // console.log(error);
        // console.log(error.error.errors);
        if (error.error?.errors && Array.isArray(error.error.errors)) {
          this.errorMessage = error.error.errors.map((err: any) => err.msg).join(' | ');
        } else {
          this.errorMessage = "Une erreur s'est produite :"+error.error.message;
        }
        // this.errorMessage = error.error.message;
        this.loading = false;
      },
    });

    this.submitted = false;
  }

}
