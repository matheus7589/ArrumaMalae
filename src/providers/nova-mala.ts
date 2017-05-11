import { Injectable, EventEmitter } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import { AngularFire } from 'angularfire2';

/*
Generated class for the NovaMala provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NovaMala {
  public malas: any;
  emitir:EventEmitter<any> = new EventEmitter();

  constructor(public fire: AngularFire,) {

    var pasta = firebase.auth().currentUser.uid;

    this.malas = firebase.database().ref('/minhasMalas/' + pasta);
  }

  addMala(tipo: string, tamanho: string, foto: string, cor: string, modelo: string, url: string): firebase.Promise<any>{
    console.log("tipo", tipo);
    return this.malas.push({
      tipo: tipo,
      tamanho: tamanho,
      cor: cor,
      modelo: modelo,
      url: url,
      alugada: false
    }).then(()=>{
      this.emitir.emit(true);
    });
  }

  atualizaMala(tipo: string, tamanho: string, foto: string, cor: string, modelo: string, url: string, idMala: string): firebase.Promise<any>{
    var mala = firebase.database().ref('/minhasMalas/' + firebase.auth().currentUser.uid + '/' + idMala)
    return mala.set({
      tipo: tipo,
      tamanho: tamanho,
      cor: cor,
      modelo: modelo,
      url: url,
      alugada: false
    });
  }

  ofertarMala(idMala: string){
    // var mala = firebase.database().ref('/minhasMalas/' + firebase.auth().currentUser.uid + '/' + idMala);
    // return new Promise((resolve, reject) => {

      var oferta = firebase.database().ref('malasOfertadas/' + firebase.auth().currentUser.uid);

      var mala = this.fire.database.object('/minhasMalas/' + firebase.auth().currentUser.uid + '/' + idMala, { preserveSnapshot: true });
      mala.subscribe(snapshot => {

        // resolve(this.atualUser);
        return oferta.push({
          tipo: snapshot.val().tipo,
          tamanho: snapshot.val().tamanho,
          cor: snapshot.val().cor,
          modelo: snapshot.val().modelo,
          url: snapshot.val().url,
          alugada: false
        });
      });

    // });



  }

}
