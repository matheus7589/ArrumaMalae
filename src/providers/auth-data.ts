import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import firebase from 'firebase';


@Injectable()
export class AuthData {

	public fireAuth: any;
  public userProfile: any;

  constructor() {
  	this.fireAuth = firebase.auth();
  	//is creating a database reference to the userProfile node on my firebase database.
  	this.userProfile = firebase.database().ref('/userProfile');
  }

	  loginUser(email: string, password: string): firebase.Promise<any> {

	  		return this.fireAuth.signInWithEmailAndPassword(email, password);

		}

		signupUser(email: string, password: string): firebase.Promise<any> {

			// return firebase.database().ref('/userProfile').push({email, password, nome, sobrenome});

		  return this.fireAuth.createUserWithEmailAndPassword(email, password)
		    .then((newUser) => {
		      this.userProfile.child(newUser.uid).set({email: email});
    		});
    	}

    	resetPassword(email: string): firebase.Promise<any> {

  			return this.fireAuth.sendPasswordResetEmail(email);
		}

		logoutUser(): firebase.Promise<any> {

  			return this.fireAuth.signOut();
		}
}
