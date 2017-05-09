import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Usuario } from './usuario';
import { AngularFire } from 'angularfire2';
import firebase from 'firebase';


@Injectable()
export class UserData {
  atualUser: Usuario;
  constructor(public fire: AngularFire, public usuario: Usuario) {
    // this.usuario = new Usuario();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  getPerfil(){
    return new Promise((resolve, reject) => {
      var user = firebase.auth().currentUser;
      var userProfile;
      // var teste;
      this.atualUser = new Usuario();

      if (user != null) {
        userProfile = this.fire.database.object('userProfile/' + user.uid, { preserveSnapshot: true });
        userProfile.subscribe(snapshot => {
          this.atualUser.setEmail(snapshot.val().email);
          this.atualUser.setNome(snapshot.val().nome);
          this.atualUser.setSobreNome(snapshot.val().sobrenome);

          resolve(this.atualUser);
          // console.log('email: ', this.atualUser.getEmail());
          // console.log('nome: ', snapshot.val().nome);
          // console.log('sobrenome: ', snapshot.val().sobrenome);
        });
      }
    });

  }

  getUsuario(){
    return this.atualUser;
  }

}
