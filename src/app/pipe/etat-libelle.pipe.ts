import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'etatLibelle',
  standalone: true
})
export class EtatLibellePipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case 5:
        return 'En attente';
      case 15:
        return 'Réparation en cours';
      case 20:
        return 'Réparation terminée';
      case 25:
        return 'Réparation payée';
      case 0:
        return 'Rendez vous annulé';  
      default:
        return 'État inconnu';
    }
  }

}
