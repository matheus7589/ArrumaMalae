import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';

// import pages
import { HomePage } from '../pages/home/home';
import { EventCreatePage } from '../pages/event-create/event-create';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { EventListPage } from '../pages/event-list/event-list';
import { LoginPage } from '../pages/login/login';
import { PerfilPage } from '../pages/perfil/perfil';
import { ResetarSenhaPage } from '../pages/resetar-senha/resetar-senha';
import { CadastrarPage } from '../pages/cadastrar/cadastrar';
import { NovaMalaPage } from '../pages/nova-mala/nova-mala';
import { AtualizaMalaPage } from '../pages/atualiza-mala/atualiza-mala';
import { PesquisarPage } from '../pages/pesquisar/pesquisar';
import { MalaOfertaPage } from '../pages/mala-oferta/mala-oferta';
import { MenuPage } from '../pages/menu/menu';


// Import providers
import { AuthData } from '../providers/auth-data';
import { EventData } from '../providers/event-data';
import { PerfilData } from '../providers/perfil-data';
import { UserData } from '../providers/user-data';
import { Usuario } from '../providers/usuario';
import { FotoData } from '../providers/foto-data';
import { NovaMala } from '../providers/nova-mala';

export const firebaseConfig = {
  apiKey: "AIzaSyCl4hPyffeXUKAEGTngBmDveGoqeBEP9XY",
  authDomain: "arrumamalae-1d2f1.firebaseapp.com",
  databaseURL: "https://arrumamalae-1d2f1.firebaseio.com",
  storageBucket: "arrumamalae-1d2f1.appspot.com",
  messagingSenderId: "210748761099"
};

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
    CadastrarPage,
    NovaMalaPage,
    AtualizaMalaPage,
    PesquisarPage,
    MalaOfertaPage,
    MenuPage
    // Usuario
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
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
    CadastrarPage,
    NovaMalaPage,
    AtualizaMalaPage,
    PesquisarPage,
    MalaOfertaPage,
    MenuPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthData,
    EventData,
    PerfilData,
    UserData,
    Usuario,
    FotoData,
    NovaMala
  ]
})
export class AppModule {}
