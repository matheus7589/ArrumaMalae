import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { EventCreatePage } from '../pages/event-create/event-create';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { EventListPage } from '../pages/event-list/event-list';
import { LoginPage } from '../pages/login/login';
import { PerfilPage } from '../pages/perfil/perfil';
import { ResetarSenhaPage } from '../pages/resetar-senha/resetar-senha';
import { CadastrarPage } from '../pages/cadastrar/cadastrar';

// Import providers
import { AuthData } from '../providers/auth-data';
import { EventData } from '../providers/event-data';
import { PerfilData } from '../providers/perfil-data';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EventCreatePage,
    EventDetailPage,
    EventListPage,
    LoginPage,
    PerfilPage,
    ResetarSenhaPage,
    CadastrarPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EventCreatePage,
    EventDetailPage,
    EventListPage,
    LoginPage,
    PerfilPage,
    ResetarSenhaPage,
    CadastrarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthData,
    EventData,
    PerfilData
  ]
})
export class AppModule {}
