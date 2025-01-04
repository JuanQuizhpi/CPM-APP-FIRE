import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule , MatIconButton } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { user } from '@angular/fire/auth';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule,MatButtonModule,NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})  
export default class HomeComponent implements OnInit {

  userRole: 'student' | 'admin' | null = null ;

  private authService = inject(AuthService);
  private _router = inject(Router);

  async logOut(): Promise<void> {
    try {
      await this.authService.logOut();
      this._router.navigateByUrl('/auth/log-in');
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    //Obtener el rol del usuario autenticado
    this.authService.authState$.subscribe((user)=>{
      if(user){
        const email = user.email || '';
        this.userRole =this.authService.getUserRole(email);
      }else{
        this.userRole = null;
      }
    });
  }



  /**
   * Control Log Out 
   */

  showLogoutConfirmation() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Estás a punto de cerrar sesión.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.logOut();
      }
    });
  }


}
