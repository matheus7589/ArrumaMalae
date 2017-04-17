import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { UserData } from '../../providers/user-data';
import { LoginPage } from '../../pages/login/login';
import { Usuario } from '../../providers/usuario';
import { AngularFire } from 'angularfire2';
// import firebase from 'firebase';

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
  userNome: any;
  userSobrenome: any;

  constructor(public navCtrl: NavController, public nav: NavController, public fire: AngularFire, public authData: AuthData, public userData: UserData, usuario: Usuario) {

    this.userData.getPerfil((data) => {
      // do something here
      this.userNome = data.getNome();
      this.userSobrenome = data.getSobreNome();
      console.log(data);
    });
    // this.userProfile = userData.atualUser;



    // var nome = this.userData.atualUser.getNome();


  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
    // console.log('nome', this.userProfile.getNome());
  }

  logOut(){
    this.authData.logoutUser().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }


}
