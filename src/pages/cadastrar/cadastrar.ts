import {
  NavController,
  LoadingController,
  AlertController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';
import { AngularFire, FirebaseListObservable } from 'angularfire2';


@Component({
  selector: 'page-cadastrar',
  templateUrl: 'cadastrar.html'
})

export class CadastrarPage {
	public signupForm;
    loading: any;
    perfis: FirebaseListObservable<any>;

  constructor(public nav: NavController, public authData: AuthData,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, fire: AngularFire) {

	    this.signupForm = formBuilder.group({
        nome: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
        sobrenome: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
	      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
	      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
	    })

      // this.perfis = fire.database.list('/perfil');


    }

    signupUser(){
	  if (!this.signupForm.valid){
	    console.log(this.signupForm.value);
	  } else {
	    this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.nome, this.signupForm.value.sobrenome)
	    .then(() => {
	      this.loading.dismiss().then( () => {
	        this.nav.setRoot(HomePage);
	      });
	    }, (error) => {
	      this.loading.dismiss().then( () => {
	        let alert = this.alertCtrl.create({
	          message: error.message,
	          buttons: [
	            {
	              text: "Ok",
	              role: 'cancelar'
	            }
	          ]
	        });
	        alert.present();
	      });
	    });
	    this.loading = this.loadingCtrl.create();
	    this.loading.present();
	  }
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastrarPage');
  }

}
