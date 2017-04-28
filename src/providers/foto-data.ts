import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
import { Camera, Device } from 'ionic-native';
import * as firebase from 'firebase';

/*
Generated class for the FotoData provider.

See https://angular.io/docs/ts/latest/guide/dependency-injection.html
for more info on providers and Angular 2 DI.
*/

declare var window: any;


@Injectable()
export class FotoData {
  public loading;
  assetCollection;

  constructor(public http: Http, public loadingCtrl: LoadingController) {
    console.log('Hello FotoData Provider');
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  carregaFoto(callback: (data) => void) {
    var result;
    // carrega foto do firebase
    firebase.database().ref('assets').child(firebase.auth().currentUser.uid).once('value', (_snapshot: any) => {

      var element = _snapshot.val().URL;
      result = element;

      callback(result);

    });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  pegaFoto(tipo: number){
    console.log(Device)
    var imageSource;
    // var url;
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


    return new Promise((resolve, reject) => {

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
        resolve(_uploadSnapshot.downloadURL);
        // armazena referencia para armazenar na base de dados
        return this.salvarParaAssetsDaBaseDeDados(_uploadSnapshot);

      }).then((_uploadSnapshot: any) => {
        alert('Arquivo salvo para o catálogo com sucesso');
        this.loading.dismiss();
        // return this.assetCollection;
      }, (_error) => {
        alert('Erro ' + (_error.message || _error));
        this.loading.dismiss();
        // return "erro";
      });

    });

  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    });

  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  pegaFotoMala(tipo: number){
    console.log(Device)
    var imageSource;
    var path;
    if(tipo == 1){
      imageSource = Camera.PictureSourceType.CAMERA;
    }else if(tipo == 2){
      imageSource = Camera.PictureSourceType.PHOTOLIBRARY;
    }

    // this.loading = this.loadingCtrl.create({ // inicia o loading
    //   content: "Aguarde..."
    // });


    // return new Promise((resolve, reject) => {

      Camera.getPicture({
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: imageSource,
        targetHeight: 640,
        correctOrientation: true
      }).then((_imagePath) => {
          path = _imagePath;
          alert('caminho' + path);
      });
    // });
    
  }


}
