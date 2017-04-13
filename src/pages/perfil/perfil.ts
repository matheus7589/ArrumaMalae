import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { UserData } from '../../providers/user-data';
import { LoginPage } from '../../pages/login/login';
// import { Usuario } from '../models/usuario';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';

/*
Generated class for the Perfil page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})

export class PerfilPage {
  userProfile: any;

  constructor(public navCtrl: NavController, public nav: NavController, public fire: AngularFire, public authData: AuthData) {

    // this.userData.getPerfil();
    // this.userProfile = this.userData.getUsuario();

    // console.log('nome', this.userProfile.nome);

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
  }

  logOut(){
    this.authData.logoutUser().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }


}
