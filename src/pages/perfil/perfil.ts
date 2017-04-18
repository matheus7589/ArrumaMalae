import { Component, ChangeDetectionStrategy, Input, NgZone } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { UserData } from '../../providers/user-data';
import { LoginPage } from '../../pages/login/login';
import { Usuario } from '../../providers/usuario';
import { AngularFire } from 'angularfire2';
import { Http } from '@angular/http';
import { Camera, Device } from 'ionic-native';
// import firebase from 'firebase';
import * as firebase from 'firebase';



declare var window: any;

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html'
})

export class PerfilPage {
  userNome: any;
  userSobrenome: any;

  constructor(public navCtrl: NavController, public nav: NavController, public fire: AngularFire, public authData: AuthData, public userData: UserData, usuario: Usuario,
    public platform: Platform,
      private http: Http,
      private zone: NgZone) {

    this.userData.getPerfil((data) => {
      // do something here
      this.userNome = data.getNome();
      this.userSobrenome = data.getSobreNome();
      console.log(data);
    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
    // console.log('nome', this.userProfile.getNome());
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  pegaFoto(){
    console.log(Device)
    // let imageSource = (Device.isVirtual ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA);
    let imageSource = Camera.PictureSourceType.PHOTOLIBRARY;

    Camera.getPicture({
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: imageSource,
      targetHeight: 640,
      correctOrientation: true
    }).then((_imagePath) => {
      alert('Caminho do arquivo ' + _imagePath);
      // converte a imagem para blob(Blobs geralmente são objetos de imagem, áudio ou outro objetos multimedia)
      return this.transformarArqEmBlob(_imagePath);
    }).then((_imageBlob) => {
      alert('Transforou em Blob ' + _imageBlob);

      // upa o blob
      return this.uploadParaFirebase(_imageBlob);
    }).then((_uploadSnapshot: any) => {
      alert('Arquivo carregado com sucesso  ' + _uploadSnapshot.downloadURL);

      // armazena referencia para armazenar na base de dados
      return this.salvarParaAssetsDaBaseDeDados(_uploadSnapshot);

    }).then((_uploadSnapshot: any) => {
      alert('Arquivo salvo para o catálogo com sucesso');
    }, (_error) => {
      alert('Erro ' + (_error.message || _error));
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  transformarArqEmBlob(_imagePath) {

  // Instalar - cordova plugin add cordova-plugin-file
  return new Promise((resolve, reject) => {
    window.resolveLocalFileSystemURL('file://' + _imagePath, (fileEntry) => { // se for imagem da biblioteca
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

  return new Promise((resolve, reject) => {
    var fileRef = firebase.storage().ref('imagens/' + fileName);

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

    ref.push(dataToSave, (_response) => {
      resolve(_response);
    }).catch((_error) => {
      reject(_error);
    });
  });

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  logOut(){
    this.authData.logoutUser().then(() => {
      this.nav.setRoot(LoginPage);
    });
  }


}
