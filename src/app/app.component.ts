import { Component, NgZone } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

import firebase from 'firebase';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage: any;
  zone: NgZone;

  constructor(platform: Platform, private statusBar: StatusBar, splashScreen: SplashScreen) {
    this.zone = new NgZone({});
    firebase.initializeApp({
        apiKey: "AIzaSyCl4hPyffeXUKAEGTngBmDveGoqeBEP9XY",
        authDomain: "arrumamalae-1d2f1.firebaseapp.com",
        databaseURL: "https://arrumamalae-1d2f1.firebaseio.com",
        storageBucket: "arrumamalae-1d2f1.appspot.com",
        messagingSenderId: "210748761099"
      });


      const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
        this.zone.run( () => {
          if (!user) {
            this.rootPage = LoginPage;
            unsubscribe();
          } else {
            this.rootPage = HomePage;
            unsubscribe();
          }
        });
      });


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
