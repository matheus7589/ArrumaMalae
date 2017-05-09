import { Component, NgZone } from '@angular/core';
import { NavController, Platform, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { UserData } from '../../providers/user-data';
import { LoginPage } from '../../pages/login/login';
import { NovaMalaPage } from '../../pages/nova-mala/nova-mala';
import { FotoData } from '../../providers/foto-data';
import { Usuario } from '../../providers/usuario';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
// import { Http } from '@angular/http';
// import { Camera, Device } from 'ionic-native';
// import firebase from 'firebase';
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
  minhasMalas: FirebaseListObservable<any>;
  badgeMinhasMalas = 0;

  constructor(public nav: NavController, public fire: AngularFire, public authData: AuthData, public userData: UserData, usuario: Usuario,
    public platform: Platform,
    private zone: NgZone,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public fotoData: FotoData,
    public alertCtrl: AlertController) {

      this.loading = loadingCtrl.create({ // inicia o loading
        content: "Aguarde..."
      });

      this.loading.present().then(() => {

        this.userData.getPerfil().then((data) => { // Carrega dados do usuário
          var userAux: any = data;
          this.userNome = userAux.getNome();
          this.userSobrenome = userAux.getSobreNome();
          console.log('Nome', this.userNome);
        });

        this.fotoData.carregaFoto().then((data) =>{ // Carrega foto do usuario
          this.assetCollection = data;
          console.log("URL: ", this.assetCollection);
        });

        this.loading.dismiss(); // tira o loading depois de ter carregado os dados e a foto

      });

      this.minhasMalas = fire.database.list('/minhasMalas');
      this.minhasMalas.subscribe(snapshots => {
        // this.badgeMinhasMalas = snapshots.numChildren();
        snapshots.forEach(snapshot => {
          this.badgeMinhasMalas++;
        });
      });

      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      presentLoading() {
        let loader = this.loadingCtrl.create({
          content: "Please wait...",
          duration: 3000
        });
        loader.present();
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


      ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


      ionViewDidLoad() {
        console.log('ionViewDidLoad PerfilPage');
        // this.presentLoading();
        // console.log('nome', this.userProfile.getNome());
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


      logOut(){
        this.authData.logoutUser().then(() => {
          this.nav.setRoot(LoginPage);
        });
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

      adicionarMala(){
        // alert('teste');
        this.nav.push(NovaMalaPage);
      }

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    }
