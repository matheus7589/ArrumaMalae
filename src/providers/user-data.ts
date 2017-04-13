import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Usuario } from '../models/usuario';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import firebase from 'firebase';


@Injectable()
export class UserData {

  constructor(public fire: AngularFire, public usuario: Usuario) {

  }

  getPerfil() : void {
    var user = firebase.auth().currentUser;
    var userProfile;

    if (user != null) {
      userProfile = this.fire.database.object('userProfile/' + user.uid, { preserveSnapshot: true });
      userProfile.subscribe(snapshot => {
        this.usuario.setEmail(snapshot.val().email);
        this.usuario.setEmail(snapshot.val().nome);
        this.usuario.setEmail(snapshot.val().sobrenome);


        console.log('teste: ', snapshot.val().email);
        console.log('teste: ', snapshot.val().nome);
        console.log('teste: ', snapshot.val().sobrenome);
      });
    }
  }

  getUsuario(){
    return this.usuario;
  }

}
