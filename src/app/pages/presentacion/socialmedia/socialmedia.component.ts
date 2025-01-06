import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-socialmedia',
  standalone: true,
  imports: [CommonModule,MatCardModule,MatButtonModule,NgFor],
  templateUrl: './socialmedia.component.html',
  styleUrl: './socialmedia.component.scss',
})
export class SocialmediaComponent {
  socialMedia = [
    {
      name: 'Instagram',
      description: 'Síguenos en Instagram para ver fotos y actualizaciones.',
      link: 'https://www.instagram.com/ciudadpatrimoniomundial/',
    },
    {
      name: 'YouTube',
      description: 'Visita nuestro canal de YouTube para contenido en video.',
      link: 'https://www.youtube.com/channel/UCwdISLeiPE5o7pKUKlqlKNg',
    },
    {
      name: 'Facebook',
      description: 'Conéctate con nosotros en Facebook.',
      link: 'https://www.facebook.com/proyectoCPM',
    },
  ];

  openLink(link: string): void {
    window.open(link, '_blank');
  }
}
