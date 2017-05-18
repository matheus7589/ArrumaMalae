import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MalaOfertaPage } from '../../pages/mala-oferta/mala-oferta';
import { AngularFire } from 'angularfire2';

import firebase from 'firebase';

/*
Generated class for the Pesquisar page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-pesquisar',
  templateUrl: 'pesquisar.html'
})
export class PesquisarPage{
  searching: any = false;
  public ofertasLista: Array<any>;
  public ofertasListaCarregadas: Array<any>;
  public ofertaRef:firebase.database.Reference;

  constructor(public nav: NavController, public navParams: NavParams, public fire: AngularFire) {
    this.ofertaRef = firebase.database().ref('/malasParaAlugar/');
    this.initializeData();
    this.initializeItems();
  }

  initializeData() {
    // this.items = [
    //   'Amsterdam',
    //   'Bogota',
    // ];
    // this.ofertas = this.fire.database.list('/malasOfertadas/' + firebase.auth().currentUser.uid);
    this.ofertaRef.on('value', ofertasLista => {
      let ofertas = [];
      ofertasLista.forEach( oferta => {
        // console.log('oferta: ', oferta.val());
        ofertas.push(oferta.val());
        return false;
      });

      this.ofertasLista = ofertas;
      this.ofertasListaCarregadas = ofertas;
    });

  }

  initializeItems(): void {
    this.ofertasLista = this.ofertasListaCarregadas;
  }


  getItems(searchbar) {
    this.searching = false;
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;


    // if the value is an empty string don't filter the items
    if (!q) {
      return;
    }

    // if the value is an empty string don't filter the items
    this.ofertasLista = this.ofertasLista.filter((v) => {
    if(v.modelo && q) {
      if (v.modelo.toLowerCase().indexOf(q.toLowerCase()) > -1) {
        this.searching = true;
        return true;
      }
      return false;
    }
  });
  console.log(q, this.ofertasLista.length);

}

itemSelected(id){
  // console.log('ID:  ', id);
  this.nav.push(MalaOfertaPage, {
    id: id
  });
}

  ionViewDidLoad() {
      this.initializeData();
      this.initializeItems();
    console.log('ionViewDidLoad PesquisarPage');
  }

}
