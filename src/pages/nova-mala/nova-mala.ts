import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { FotoData } from '../../providers/foto-data';
import * as firebase from 'firebase';

/*
  Generated class for the NovaMala page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-nova-mala',
  templateUrl: 'nova-mala.html'
})
export class NovaMalaPage {
  public malas;
  public novaMalaForm;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
     public actionSheetCtrl: ActionSheetController, public fotoData: FotoData) {

    this.novaMalaForm = formBuilder.group({
        tipo: ['', Validators.compose([Validators.required])],
        tamanho: ['', Validators.compose([Validators.required])],
        foto: ['', Validators.compose([Validators.required])],
        cor: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
        modelo: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
    })

    this.malas = firebase.database().ref('/malas');


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NovaMalaPage');
  }

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
            this.fotoData.pegaFotoMala(1);
          }
        },{
          text: 'Carregar foto da galeria',
          icon: 'images',
          handler: () => {
            console.log('Galeria foi clicado');
            this.fotoData.pegaFotoMala(2);
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

  adicionarMala(){
    alert('Entrou');
    if (!this.novaMalaForm.valid){
	    console.log(this.novaMalaForm.value);
	  } else {
      this.malas.push({
        tipo: this.novaMalaForm.value.tipo,
        tamanho: this.novaMalaForm.value.tamanho,
        cor: this.novaMalaForm.value.cor,
        modelo: this.novaMalaForm.value.modelo
      });
    }
  }

}
