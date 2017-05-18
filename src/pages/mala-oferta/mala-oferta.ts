import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';

import firebase from 'firebase';

/*
Generated class for the MalaOferta page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-mala-oferta',
  templateUrl: 'mala-oferta.html'
})
export class MalaOfertaPage {
  public id;
  public malaRef;
  public dadosMala;

  constructor(public nav: NavController, public navParams: NavParams, public fire: AngularFire, menu: MenuController) {

    menu.enable(true);

    this.dadosMala = "assets/images/no-image.jpg";

    this.id = navParams.get('id');

    this.malaRef = fire.database.object('/malasParaAlugar/' + this.id, { preserveSnapshot: true });

    this.getData().then((data) => {
      var auxiliar: any = data;
      this.dadosMala = auxiliar;
      // console.log('dados', this.dadosMala.url);
    });

  }

  getData(){

    return new Promise((resolve, reject) => {

      this.malaRef.subscribe(snapshot => {
        var data = {
          url: snapshot.val().url,
          cor: snapshot.val().cor,
          modelo: snapshot.val().modelo,
          tamanho: snapshot.val().tamanho,
          tipo: snapshot.val().tipo,
          valor: snapshot.val().valor
        }
        resolve(data);
      });
    })
  }

  ionViewDidLoad() {
    // console.log('ID:  ', this.id);

  }

}
