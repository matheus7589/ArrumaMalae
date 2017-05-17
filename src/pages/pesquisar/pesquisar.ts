import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

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
export class PesquisarPage {

  searchQuery: string = '';
  items: string[];
  ofertas: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fire: AngularFire) {
    this.initializeItems();
  }

  initializeItems() {
    // this.items = [
    //   'Amsterdam',
    //   'Bogota',
    // ];
    this.ofertas = this.fire.database.list('/malasOfertadas/' + firebase.auth().currentUser.uid);
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.ofertas = this.ofertas.filter((item) =>{
        console.log(item);
        return (item.modelo.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      // this.items = this.items.filter((item) => {
      //   return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      // })
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PesquisarPage');
  }

}
