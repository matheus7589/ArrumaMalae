import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PesquisarPage } from '../../pages/pesquisar/pesquisar';
import { PerfilPage } from '../../pages/perfil/perfil';

/*
  Generated class for the Menu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  private rootPage;
  private pesquisarPage;
  private perfilPage;


  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.rootPage = PesquisarPage;

    this.pesquisarPage = PesquisarPage;
    this.perfilPage = PerfilPage;

  }

  openPage(p) {
    this.rootPage = p;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

}
