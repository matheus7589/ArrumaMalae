import { Component, NgZone, EventEmitter } from '@angular/core';
import { NavController, Platform, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { UserData } from '../../providers/user-data';
// import { LoginPage } from '../../pages/login/login';
import { NovaMalaPage } from '../../pages/nova-mala/nova-mala';
import { AtualizaMalaPage } from '../../pages/atualiza-mala/atualiza-mala';
import { NovaMala } from '../../providers/nova-mala';
import { FotoData } from '../../providers/foto-data';
import { Usuario } from '../../providers/usuario';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
// import { Http } from '@angular/http';
// import { Camera, Device } from 'ionic-native';
import firebase from 'firebase';
// import * as firebase from 'firebase';



declare var window: any;

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})

export class PerfilPage {
  assetCollection
  // userAux: any;
  userNome: any;
  userSobrenome: any;
  public loading;
  public alert;
  minhasMalas: FirebaseListObservable<any[]>;
  minhasOfertas: FirebaseListObservable<any[]>;
  badgeMinhasMalas = 0;
  badgeMinhasOfertas = 0;
  emitir: EventEmitter<true>;

  constructor(public nav: NavController, public fire: AngularFire, public authData: AuthData, public userData: UserData, usuario: Usuario,
    public platform: Platform,
    private zone: NgZone,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public fotoData: FotoData,
    public alertCtrl: AlertController,
    public novaMala: NovaMala) {

      this.loading = loadingCtrl.create({ // inicia o loading
        content: "Aguarde..."
      });

      this.loading.present().then(() => {

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

        this.loading.dismiss(); // tira o loading depois de ter carregado os dados e a foto

      });

      this.novaMala.emitir.subscribe(status => {
        if(status == true){
          var ref = firebase.database().ref('/minhasMalas');
          var self = this;// gambiarra q eu n entendi
          ref.once("value").then(function(snapshot){
            self.badgeMinhasMalas = snapshot.child(firebase.auth().currentUser.uid).numChildren();
          });
        }
      });

      this.novaMala.emitir.subscribe(status => {
        if(status == true){
          var ref = firebase.database().ref('/malasOfertadas');
          var self = this;// gambiarra q eu n entendi
          ref.once("value").then(function(snapshot){
            self.badgeMinhasOfertas = snapshot.child(firebase.auth().currentUser.uid).numChildren();
          });
        }
      });

      this.minhasMalas = fire.database.list('/minhasMalas/' + firebase.auth().currentUser.uid);
      this.minhasOfertas = fire.database.list('/malasOfertadas/' + firebase.auth().currentUser.uid);

      // this.minhasMalas.subscribe(snapshots => {
      //   // this.badgeMinhasMalas = snapshots.numChildren();
      //   this.badgeMinhasMalas = snapshots.numChildren(firebase.auth().currentUser.uid);
      //   // snapshots.forEach(snapshot => {
      //   //
      //   // });
      // });

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    presentLoading() {
      let loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 3000
      });
      loader.present();

      //

    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    presentActionSheet() {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Editar foto',
        buttons: [
          {
            text: 'Tirar foto',
            // role: 'tirarfoto',
            icon: 'camera',
            handler: () => {
              console.log('tirar foto clicado');
              // this.pegaFoto(1);
              this.fotoData.pegaFoto(1).then((data) => {
                this.assetCollection = data;
              });
            }
          },{
            text: 'Carregar foto da galeria',
            icon: 'images',
            handler: () => {
              console.log('Galeria foi clicado');
              // this.pegaFoto(2);
              this.fotoData.pegaFoto(2).then((data) => { // Recupara o Promise da função pega foto.
                // alert('Caminho do arquivo ' + data);  // O promise garante que toda a função será executada antes de atribuir o valor à variável assetCollection
                this.assetCollection = data;
              });
            }
          },{
            text: 'Cancelar',
            role: 'cancel',
            icon: 'close',
            handler: () => {
              console.log('Cancelar clicado');
            }
          }
        ]
      });
      actionSheet.present();

    }


    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    deletar(id){
      // console.log('Deletou:' + id);
      this.minhasMalas.remove(id);
      this.updateBadgeMinhasMalas();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    deletarOfertada(id){
      var mala = this.fire.database.object('/minhasMalas/' + firebase.auth().currentUser.uid + '/' + id, { preserveSnapshot: true });

      var paraAlugar = this.fire.database.list('/malasParaAlugar/');

      return new Promise((resolve, reject) => {

        mala.subscribe(snapshot => {
          var aux = {
            tipo: snapshot.val().tipo,
            tamanho: snapshot.val().tamanho,
            cor: snapshot.val().cor,
            modelo: snapshot.val().modelo,
            url: snapshot.val().url,
            alugada: false,
            ofertada: false,
            valor: snapshot.val().valor
          };
          console.log('Deletou:' + id);
          resolve(aux);
        });

      }).then((data)=>{
        var aux: any = data;
        mala.set({
          tipo: aux.tipo,
          tamanho: aux.tamanho,
          cor: aux.cor,
          modelo: aux.modelo,
          url: aux.url,
          alugada: false,
          ofertada: false,
          valor: aux.valor
        });
        console.log("ID", id);
        paraAlugar.remove(id);
        this.minhasOfertas.remove(id);
        this.updateBadgeMinhasOfertas();
      })

      // this.minhasOfertas.remove(id);
      // this.updateBadgeMinhasOfertas();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ofertar(id){

      this.novaMala.ofertarMala(id).then((data)=>{
      });


    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    update(id){
      this.nav.push(AtualizaMalaPage, {
        id: id
      });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    updateBadgeMinhasMalas(){
      var ref = firebase.database().ref('/minhasMalas');
      var self = this;// gambiarra q eu n entendi
      ref.once("value").then(function(snapshot){
        self.badgeMinhasMalas = snapshot.child(firebase.auth().currentUser.uid).numChildren();
      });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    updateBadgeMinhasOfertas(){
      var ref2 = firebase.database().ref('/malasOfertadas');
      var self2 = this;// gambiarra q eu n entendi
      ref2.once("value").then(function(snapshot){
        self2.badgeMinhasOfertas = snapshot.child(firebase.auth().currentUser.uid).numChildren();
      });
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ionViewDidLoad() {
      console.log('ionViewDidLoad PerfilPage');
      // this.presentLoading();
      // console.log('nome', this.userProfile.getNome());

      this.updateBadgeMinhasMalas();
      this.updateBadgeMinhasOfertas();

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    // logOut(){
    //   this.authData.logoutUser().then(() => {
    //     this.nav.setRoot(LoginPage);
    //   });
    // }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    adicionarMala(){
      // alert('teste');
      this.nav.push(NovaMalaPage);
      this.updateBadgeMinhasMalas();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  }
