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
  // public itens: FirebaseListObservable<any>;
  public auxiliar: any;
  emitir:EventEmitter<any> = new EventEmitter();

  constructor(public fire: AngularFire,) {

    var pasta = firebase.auth().currentUser.uid;

    this.malas = firebase.database().ref('/minhasMalas/' + pasta);

    // this.itens = fire.database.list('/minhasMalas/' + pasta);
  }

  addMala(tipo: string, tamanho: string, foto: string, cor: string, modelo: string, url: string, valor: string): firebase.Promise<any>{
    // console.log("tipo", tipo);
    return this.malas.push({
      tipo: tipo,
      tamanho: tamanho,
      cor: cor,
      modelo: modelo,
      url: url,
      alugada: false,
      ofertada: false,
      valor: valor
    }).then(()=>{
      this.emitir.emit(true);
    });
  }

  atualizaMala(tipo: string, tamanho: string, foto: string, cor: string, modelo: string, url: string, idMala: string, valor: string): firebase.Promise<any>{
    var mala = firebase.database().ref('/minhasMalas/' + firebase.auth().currentUser.uid + '/' + idMala)
    return mala.set({
      tipo: tipo,
      tamanho: tamanho,
      cor: cor,
      modelo: modelo,
      url: url,
      alugada: false,
      ofertada: false,
      valor: valor
    });
  }

  getMalaOferta(idMala: string){

    return new Promise((resolve, reject) => {
      var mala = this.fire.database.object('/minhasMalas/' + firebase.auth().currentUser.uid + '/' + idMala, { preserveSnapshot: true });
      mala.subscribe(snapshot => {
        var aux = {
          tipo: snapshot.val().tipo,
          tamanho: snapshot.val().tamanho,
          cor: snapshot.val().cor,
          modelo: snapshot.val().modelo,
          url: snapshot.val().url,
          alugada: false,
          ofertada: false,
          valor: snapshot.val().valor
        };
        // console.log("teste");
        resolve(aux);
      });
    });

  }

  ofertarMala(idMala: string){
    // var mala = this.fire.database.list('/minhasMalas/' + firebase.auth().currentUser.uid);
    var mala = this.fire.database.object('/minhasMalas/' + firebase.auth().currentUser.uid + '/' + idMala, { preserveSnapshot: true });
    return new Promise((resolve, reject) => {

      var oferta = firebase.database().ref('/malasOfertadas/' + firebase.auth().currentUser.uid + '/' + idMala);

      var paraAlugar = firebase.database().ref('/malasParaAlugar/' + idMala);

      this.getMalaOferta(idMala).then((data) => {
        this.auxiliar = data;
        return mala.set({
          tipo: this.auxiliar.tipo,
          tamanho: this.auxiliar.tamanho,
          cor: this.auxiliar.cor,
          modelo: this.auxiliar.modelo,
          url: this.auxiliar.url,
          alugada: false,
          ofertada: true,
          valor: this.auxiliar.valor
        });

      }).then((data)=>{
        // console.log("tipo: ", this.auxiliar);
        return oferta.set({
          tipo: this.auxiliar.tipo,
          tamanho: this.auxiliar.tamanho,
          cor: this.auxiliar.cor,
          modelo: this.auxiliar.modelo,
          url: this.auxiliar.url,
          alugada: false,
          ofertada: true,
          valor: this.auxiliar.valor
        }).then(()=>{

          paraAlugar.set({
            tipo: this.auxiliar.tipo,
            tamanho: this.auxiliar.tamanho,
            cor: this.auxiliar.cor,
            modelo: this.auxiliar.modelo,
            url: this.auxiliar.url,
            alugada: false,
            ofertada: true,
            idmala: idMala,
            iduser: firebase.auth().currentUser.uid,
            valor: this.auxiliar.valor
          });

          // console.log("antes");
          this.emitir.emit(true);
          resolve(oferta);
          // var aux: any = idMala;
          // this.itens.remove(aux);
        });

      });

    });



  }

}
