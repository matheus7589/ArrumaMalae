import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { FotoData } from '../../providers/foto-data';
import { NovaMala } from '../../providers/nova-mala';
import { AngularFire } from 'angularfire2';
import firebase from 'firebase';

/*
Generated class for the AtualizaMala page.

See http://ionicframework.com/docs/v2/components/#navigation for more info on
Ionic pages and navigation.
*/
@Component({
  selector: 'page-atualiza-mala',
  templateUrl: 'atualiza-mala.html'
})
export class AtualizaMalaPage {
  public atualizaMalaForm;
  public urlMala: any;
  public id;
  public modelo; tipo; tamanho; cor;


  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    public actionSheetCtrl: ActionSheetController, public fotoData: FotoData, public novaMala: NovaMala, public fire: AngularFire) {

      this.atualizaMalaForm = formBuilder.group({
        tipo: ['', Validators.compose([Validators.required])],
        tamanho: ['', Validators.compose([Validators.required])],
        // foto: ['', Validators.compose([Validators.required])],
        cor: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
        modelo: ['', Validators.compose([Validators.maxLength(30), Validators.required])]
      });

      this.id = navParams.get('id');

      this.urlMala = "assets/images/no-image.jpg";

      this.getData().then((data) => {
        // var aux: any = data;
        this.urlMala = data;
        console.log("este", this.urlMala.url);
      });
    }

    getData(){

      return new Promise((resolve, reject) => {
        var user = firebase.auth().currentUser;
        // console.log('minhasMalas/' + user.uid + '/' + this.id);
        var atualMala = this.fire.database.object('minhasMalas/' + user.uid + '/' + this.id, { preserveSnapshot: true });
        atualMala.subscribe(snapshot =>{
          var mala = {
            tipo: snapshot.val().tipo,
            tamanho: snapshot.val().tamanho,
            cor: snapshot.val().cor,
            modelo: snapshot.val().modelo,
            url: snapshot.val().url
          };
          // console.log(snapshot.tamanho);
          resolve(mala);
        });
      });
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    ionViewDidLoad() {
      console.log('ionViewDidLoad AtualizaMalaPage');
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
              this.fotoData.pegaFotoMala(1).then((data) =>{
                this.urlMala.url = data;
              });
            }
          },{
            text: 'Carregar foto da galeria',
            icon: 'images',
            handler: () => {
              console.log('Galeria foi clicado');
              this.fotoData.pegaFotoMala(2).then((data) =>{
                this.urlMala.url = data;
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    atualizarMala(){

      this.fotoData.enviaFotoMala().then((data)=>{
        // alert('Entrou');
        this.urlMala.url = data;
        this.novaMala.atualizaMala(this.atualizaMalaForm.value.tipo, this.atualizaMalaForm.value.tamanho, this.atualizaMalaForm.value.foto,
          this.atualizaMalaForm.value.cor, this.atualizaMalaForm.value.modelo, this.urlMala.url, this.id).then(() => {

          });
        }, (_error) => {
          alert('Erro ' + (_error.message || _error));
        });

      }

    }
