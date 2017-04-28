import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';

/*
Generated class for the NovaMala provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NovaMala {
  public malas: any;

  constructor() {
    this.malas = firebase.database().ref('/minhasMalas');
  }

  addMala(tipo: string, tamanho: string, foto: string, cor: string, modelo: string): firebase.Promise<any>{
    console.log("tipo", tipo);
    return this.malas.push({
        tipo: tipo,
        tamanho: tamanho,
        cor: cor,
        modelo: modelo
      });
  }

}
