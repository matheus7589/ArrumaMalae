import { Component } from '@angular/core';
import { 
  NavController, 
  LoadingController, 
  AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';


@Component({
  selector: 'page-resetar-senha',
  templateUrl: 'resetar-senha.html'
})


export class ResetarSenhaPage {
	public resetPasswordForm;

  constructor(public authData: AuthData, public formBuilder: FormBuilder, public loadingCtrl: 	LoadingController, public alertCtrl: AlertController, public nav: NavController) {

  	this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
    })
  }

	  resetPassword(){
	  if (!this.resetPasswordForm.valid){
	    console.log(this.resetPasswordForm.value);
	  } else {
	    this.authData.resetPassword(this.resetPasswordForm.value.email).then((user) => {
	      let alert = this.alertCtrl.create({
	        message: "Foi enviado um link para seu email",
	        buttons: [
	          {
	            text: "Ok",
	            role: 'cancel',
	            handler: () => {
	              this.nav.pop();
	            }
	          }
	        ]
	      });
	      alert.present();

	    }, (error) => {
	      var errorMessage: string = error.message;
	      let errorAlert = this.alertCtrl.create({
	        message: errorMessage,
	        buttons: [
	          {
	            text: "Ok",
	            role: 'cancelar'
	          }
	        ]
	      });
	      errorAlert.present();
	    });
	  }
	}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetarSenhaPage');
  }

}
