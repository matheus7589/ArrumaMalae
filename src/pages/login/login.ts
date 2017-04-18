import { Component } from '@angular/core';
import {
  NavController,
  LoadingController,
  AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { CadastrarPage } from '../cadastrar/cadastrar';
// import { HomePage } from '../home/home';
import { PerfilPage } from '../perfil/perfil';
import { ResetarSenhaPage } from '../resetar-senha/resetar-senha';
import { AngularFire, FirebaseListObservable } from 'angularfire2';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})


export class LoginPage {
	public loginForm;
  loading: any;

  nomes: FirebaseListObservable<any>;

  constructor(public nav: NavController, public authData: AuthData,
    public formBuilder: FormBuilder,public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, fire: AngularFire) {

    	this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.minLength(6),
        Validators.required])]
      });
      this.nomes = fire.database.list('/perfil');
    }

  ionViewDidLoad(fire: AngularFire) {
    console.log('ionViewDidLoad LoginPage');
  }

  loginUser(): void {
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password).then( authData => {
        this.loading.dismiss().then( () => {
          this.nav.setRoot(PerfilPage);
        });
      }, error => {
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

  goToSignup(): void {
    this.nav.push(CadastrarPage);
  }

  goToResetPassword(): void {
    this.nav.push(ResetarSenhaPage);
  }

}
