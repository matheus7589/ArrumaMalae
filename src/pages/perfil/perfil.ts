import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../../pages/login/login';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

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
  authEmail: any;
  userProfile: FirebaseListObservable<any>;
  perfis: FirebaseListObservable<any>;
  usuario: any;
  teste: any;
  vamosla: any;


  constructor(public navCtrl: NavController, public nav: NavController, public fire: AngularFire, public authData: AuthData) {


    this.userProfile = fire.database.list('/userProfile');
    this.perfis = fire.database.list('/perfil', { preserveSnapshot: true });


    this.fire.auth.subscribe(auth => {
      //Here you get the user information
      this.authEmail = auth.auth.email;
      console.log(this.authEmail);
    });

    // var app = angular.module('myApp', []);

    this.perfis.subscribe(snapshots => {
      // items is an array
      snapshots.forEach(snapshot => {
        if(this.authEmail == snapshot.val().email){
          // this.vamosla = snapshot.val().nome;
          console.log('Item:', JSON.stringify(snapshot));
          this.usuario = JSON.stringify(snapshot);
          // this.teste = {
            // nome: snapshot.val().nome
          // }
        }
      });
    });

    console.log('teste: ', this.usuario);

    this.teste = {
      nome: 'Matheus'
    }

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
