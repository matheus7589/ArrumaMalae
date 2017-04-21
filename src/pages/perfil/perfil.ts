import { Component, NgZone } from '@angular/core';
import { NavController, Platform, ActionSheetController, LoadingController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { UserData } from '../../providers/user-data';
import { LoginPage } from '../../pages/login/login';
import { NovaMalaPage } from '../../pages/nova-mala/nova-mala';
import { Usuario } from '../../providers/usuario';
import { AngularFire } from 'angularfire2';
import { Http } from '@angular/http';
import { Camera, Device } from 'ionic-native';
// import firebase from 'firebase';
import * as firebase from 'firebase';



declare var window: any;

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})

export class PerfilPage {
  assetCollection
  userNome: any;
  userSobrenome: any;
  public loading;

  constructor(public nav: NavController, public fire: AngularFire, public authData: AuthData, public userData: UserData, usuario: Usuario,
    public platform: Platform,
    private http: Http,
    private zone: NgZone,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController) {

      this.loading = loadingCtrl.create({ // inicia o loading
        content: "Aguarde..."
      });

      this.loading.present().then(() => {

        this.userData.getPerfil((data) => { // Carrega dados do usuário
          // do something here
          this.userNome = data.getNome();
          this.userSobrenome = data.getSobreNome();
          console.log(data);
        });

        this.carregaFoto((data) =>{ // Carrega foto do usuario
          this.assetCollection = data;
          console.log("URL: ", this.assetCollection);
        });

        this.loading.dismiss(); // tira o loadin depois de ter carregado os dados e a foto

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
              this.pegaFoto(1);
            }
          },{
            text: 'Carregar foto da galeria',
            icon: 'images',
            handler: () => {
              console.log('Galeria foi clicado');
              this.pegaFoto(2);
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

    carregaFoto(callback: (data) => void) {
      var result;
      // carrega foto do firebase
      firebase.database().ref('assets').child(firebase.auth().currentUser.uid).once('value', (_snapshot: any) => {

        var element = _snapshot.val().URL;
        result = element;

        callback(result);

      });
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    pegaFoto(tipo: number){

      console.log(Device)
      var imageSource;
      if(tipo == 1){
        imageSource = Camera.PictureSourceType.CAMERA;
      }else if(tipo == 2){
        imageSource = Camera.PictureSourceType.PHOTOLIBRARY;
      }
      // let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);
      // imageSource = Camera.PictureSourceType.PHOTOLIBRARY;

      this.loading = this.loadingCtrl.create({ // inicia o loading
        content: "Aguarde..."
      });



      Camera.getPicture({
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: imageSource,
        targetHeight: 640,
        correctOrientation: true
      }).then((_imagePath) => {
        this.loading.present();
        // alert('Caminho do arquivo ' + _imagePath);
        // converte a imagem para blob(Blobs geralmente são objetos de imagem, áudio ou outro objetos multimedia)
        return this.transformarArqEmBlob(_imagePath, tipo);
      }).then((_imageBlob) => {
        // alert('Transforou em Blob ' + _imageBlob);

        // upa o blob
        return this.uploadParaFirebase(_imageBlob);
      }).then((_uploadSnapshot: any) => {
        // alert('Arquivo carregado com sucesso  ' + _uploadSnapshot.downloadURL);

        // armazena referencia para armazenar na base de dados
        return this.salvarParaAssetsDaBaseDeDados(_uploadSnapshot);

      }).then((_uploadSnapshot: any) => {
        alert('Arquivo salvo para o catálogo com sucesso');
        this.loading.dismiss();
      }, (_error) => {
        alert('Erro ' + (_error.message || _error));
        this.loading.dismiss();
      });

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    transformarArqEmBlob(_imagePath, tipo: number) {

      var caminho;
      if(tipo == 1){
        caminho = '';
      }else if(tipo == 2){
        caminho = 'file://';
      }

      // Instalar - cordova plugin add cordova-plugin-file
      return new Promise((resolve, reject) => {
        window.resolveLocalFileSystemURL(caminho + _imagePath, (fileEntry) => { // se for imagem da biblioteca
          // window.resolveLocalFileSystemURL(_imagePath, (fileEntry) => {  // se for imagem tirada da camera

          fileEntry.file((resFile) => {
            // alert('Entrou');

            var reader = new FileReader();
            reader.onloadend = (evt: any) => {
              var imgBlob: any = new Blob([evt.target.result], { type: 'image/jpeg/jpg' });
              imgBlob.name = 'amostra.jpg';
              resolve(imgBlob);
            };

            reader.onerror = (e) => {
              console.log('Erro na leitura do arquivo: ' + e.toString());
              reject(e);
            };

            reader.readAsArrayBuffer(resFile);
          });
        });
      });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    uploadParaFirebase(_imageBlob) {
      var fileName = 'amostra-' + new Date().getTime() + '.jpg';
      // var fileName = firebase.auth().currentUser.uid;
      var pasta = firebase.auth().currentUser.uid;

      return new Promise((resolve, reject) => {

        var fileRef = firebase.storage().ref('imagens/'+ pasta + '/' + fileName);

        var uploadTask = fileRef.put(_imageBlob);

        uploadTask.on('state_changed', (_snapshot) => {
          console.log('snapshot progess ' + _snapshot);
        }, (_error) => {
          reject(_error);
        }, () => {
          // completion...
          resolve(uploadTask.snapshot);
        });
      });
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    salvarParaAssetsDaBaseDeDados(_uploadSnapshot) {
      var ref = firebase.database().ref('assets');

      return new Promise((resolve, reject) => {

        // we will save meta data of image in database
        var dataToSave = {
          'URL': _uploadSnapshot.downloadURL, // url to access file
          'nome': _uploadSnapshot.metadata.name, // name of the file
          'dono': firebase.auth().currentUser.uid,
          'email': firebase.auth().currentUser.email,
          'ultimaAtualizacao': new Date().getTime(),
        };

        ref.child(firebase.auth().currentUser.uid).set(dataToSave, (_response) => {
          resolve(_response);
        }).catch((_error) => {
          reject(_error);
        });
        this.carregaFoto((data) =>{
          this.assetCollection = data;
          console.log("URL: ", this.assetCollection);
        });
      });

    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
