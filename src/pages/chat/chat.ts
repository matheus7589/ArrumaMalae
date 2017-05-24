import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
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
export class ChatPage implements OnInit, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  assetCollection;
  userNome: any;
  userSobrenome: any;
  userEmail: any;
  firelist: FirebaseListObservable<any>;
  chat: any;
  public id;
  user;

  constructor(public fire: AngularFire, public nav: NavController, public navParams: NavParams, public userData: UserData, public fotoData: FotoData) {

    this.user = firebase.auth().currentUser;

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
      this.userEmail = userAux.getEmail();
      // console.log('Nome', userAux.getEmail());
    });

    this.fotoData.carregaFoto().then((data) =>{ // Carrega foto do usuario
      this.assetCollection = data;
      // console.log("URL: ", this.assetCollection);
    });

    // console.log("email: ",  this.user.email);

  }

  ngOnInit() {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { console.log('Scroll to bottom failed yo!') }
  }

  chatSend(va, vi){ // enviar mensagem
    var time: any = firebase.database.ServerValue.TIMESTAMP;
    console.log("data: ", time);
    this.fire.database.list('/chats/' + this.id).push({
      uid: firebase.auth().currentUser.uid,
      url: this.assetCollection,
      nome: this.userNome,
      email: this.userEmail,
      chat_text: va.chatText,
      timestamp: Date.now(),
      negativetimestamp: -Date.now() //para mais tarde fazer o download dos dados mais recentes
    })
    this.chat = '';
  }

  isYou(email) {
    if(email == this.userEmail)
      return false;
    else
      return true;
  }

  isMe(email) {
    if(email == this.userEmail)
      return true;
    else
      return false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

}
