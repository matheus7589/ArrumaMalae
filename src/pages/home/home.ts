import { Component } from '@angular/core';
import { AuthData } from '../../providers/auth-data';
import { LoginPage } from '../../pages/login/login';
//import { FormBuilder, Validators } from '@angular/forms';


import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public nav: NavController, public authData: AuthData) {
    
  }

	 logOut(){
	  this.authData.logoutUser().then(() => {
	    this.nav.setRoot(LoginPage);
	  });
	}

}
