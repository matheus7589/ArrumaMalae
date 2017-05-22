import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { ChatPage } from '../chat/chat';
import { UserData } from '../../providers/user-data';
import { FotoData } from '../../providers/foto-data';
import { AngularFire } from 'angularfire2';

import firebase from 'firebase';

/*
Generated class for the MalaOferta page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-mala-oferta',
  templateUrl: 'mala-oferta.html'
})
export class MalaOfertaPage {
  assetCollection
  userNome: any;
  userSobrenome: any;
  firelist;
  public id;
  public malaRef;
  public dadosMala;

  constructor(public nav: NavController, public navParams: NavParams, public fire: AngularFire, menu: MenuController, public userData: UserData,
  public fotoData: FotoData) {

    menu.enable(true);

    this.dadosMala = "assets/images/no-image.jpg";

    this.id = navParams.get('id');

    this.malaRef = fire.database.object('/malasParaAlugar/' + this.id, { preserveSnapshot: true });

    this.getData().then((data) => {
      var auxiliar: any = data;
      this.dadosMala = auxiliar;
      // console.log('dados', this.dadosMala.url);
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

  getData(){

    return new Promise((resolve, reject) => {

      this.malaRef.subscribe(snapshot => {
        var data = {
          url: snapshot.val().url,
          cor: snapshot.val().cor,
          modelo: snapshot.val().modelo,
          tamanho: snapshot.val().tamanho,
          tipo: snapshot.val().tipo,
          valor: snapshot.val().valor,
          iduser: snapshot.val().iduser
        }
        resolve(data);
      });
    })
  }

  getContratante(id){
    return new Promise((resolve, reject) => {
      var userProfile;
      // var teste;
      // this.atualUser = new Usuario();

      userProfile = this.fire.database.object('userProfile/' + id, { preserveSnapshot: true });
      userProfile.subscribe(snapshot => {
        var aux = ({
          nome: snapshot.val().nome,
          sobrenome: snapshot.val().sobrenome
        });
        resolve(aux);
      });
    });

  }


  carregaFoto(id) {
    var result;

    return new Promise((resolve, reject) => {
      // carrega foto do firebase
      firebase.database().ref('assets').child(id).once('value', (_snapshot: any) => {

        var element = _snapshot.val().URL;
        result = element;

        resolve(result);

        // callback(result);
      });

    });
  }

  startChat(id){
    // console.log(id);
    // this.firelist = firebase.database().ref('/chats/' + id + firebase.auth().currentUser.uid);
    // this.firelist.set({
    //   // contratado: id,
    //   // contratante: firebase.auth().currentUser.uid
    // });

    this.getContratante(id).then((data) => {
      var auxiliar: any = data;

      this.carregaFoto(id).then((data) => {
        var foto: any = data;

        var meusChats = firebase.database().ref('/meusChats/' + firebase.auth().currentUser.uid).push({
          chat: id + firebase.auth().currentUser.uid,
          contratado: id,
          contratante: firebase.auth().currentUser.uid,
          nome: auxiliar.nome,
          sobrenome: auxiliar.sobrenome,
          url: foto
        })

        var meusChats2 = firebase.database().ref('/meusChats/' + id).push({
          chat: id + firebase.auth().currentUser.uid,
          contratado: id,
          contratante: firebase.auth().currentUser.uid,
          nome: this.userNome,
          sobrenome: this.userSobrenome,
          url: this.assetCollection
        })

        this.nav.push(ChatPage, {
          id: id + firebase.auth().currentUser.uid
        })

      });


    });

    //
  }

  ionViewDidLoad() {
    // console.log('ID:  ', this.id);

  }

}
