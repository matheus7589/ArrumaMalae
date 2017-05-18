import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PesquisarPage } from '../../pages/pesquisar/pesquisar';
import { LoginPage } from '../../pages/login/login';
import { AuthData } from '../../providers/auth-data';
import { PerfilPage } from '../../pages/perfil/perfil';
import { ConversasPage } from '../../pages/conversas/conversas';
import { ChatPage } from '../../pages/chat/chat';

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
  private conversasPage;
  private chatPage;


  constructor(public nav: NavController, public navParams: NavParams, public authData: AuthData) {

    this.pesquisarPage = PesquisarPage;
    this.rootPage = this.pesquisarPage;
    this.perfilPage = PerfilPage;
    this.conversasPage = ConversasPage;
    this.chatPage = ChatPage;

  }

  openPage(p) {
    this.rootPage = p;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  logOut(){
    this.authData.logoutUser().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }

}
