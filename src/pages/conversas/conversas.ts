import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

import firebase from 'firebase';

/*
  Generated class for the Conversas page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-conversas',
  templateUrl: 'conversas.html'
})
export class ConversasPage {
  meusChats;

  constructor(public nav: NavController, public navParams: NavParams, public fire: AngularFire) {

    this.meusChats = this.fire.database.list('/meusChats/' + firebase.auth().currentUser.uid);

  }

  abreConversa(id){
    // console.log('ID:  ', id);
    this.nav.push(ChatPage, {
      id: id
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConversasPage');
  }

}
