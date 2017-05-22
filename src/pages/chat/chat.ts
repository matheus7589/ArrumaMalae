import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { FotoData } from '../../providers/foto-data';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import firebase from 'firebase';


/*
  Generated class for the Chat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  assetCollection;
  userNome: any;
  userSobrenome: any;
  firelist: FirebaseListObservable<any>;
  chat: any;
  public id;

  constructor(public fire: AngularFire, public nav: NavController, public navParams: NavParams, public userData: UserData, public fotoData: FotoData) {

    this.id = navParams.get('id');

    this.firelist = this.fire.database.list('/chats/' + this.id, {
      query: {
        orderByChild: 'timestamp', // ordem dos dados mais recentes
      }
    });

    this.userData.getPerfil().then((data) => { // Carrega dados do usuário
      var userAux: any = data;
      this.userNome = userAux.getNome();
      this.userSobrenome = userAux.getSobreNome();
      // console.log('Nome', this.userNome);
    });

    this.fotoData.carregaFoto().then((data) =>{ // Carrega foto do usuario
      this.assetCollection = data;
      // console.log("URL: ", this.assetCollection);
    });

  }

  chatSend(va, vi){ // enviar mensagem
    // console.log("data: ", Date.now());
    this.fire.database.list('/chats/' + this.id).push({
      uid: firebase.auth().currentUser.uid,
      url: this.assetCollection,
      nome: this.userNome,
      chat_text: va.chatText,
      timestamp: Date.now(),
      negativetimestamp: -Date.now() //para mais tarde fazer o download dos dados mais recentes
    })
    this.chat = '';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

}
