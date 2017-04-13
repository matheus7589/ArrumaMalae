import { Injectable, EventEmitter } from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Router } from '@angular/router';

import { empresa } from './model/empresa';

@Injectable()
export class CrudEmpresaService {

  constructor(public af: AngularFire, private router: Router, public empresa: empresa) { }

  emitirLogin = new EventEmitter<boolean>();

  logar(formData) {
    //Efetua o Login com uma conta existente    
    if (formData.valid) {
      console.log(formData.value);
      this.af.auth.login({
        email: formData.value.email,
        password: formData.value.password
      },
        {
          provider: AuthProviders.Password,
          method: AuthMethods.Password,
        }).then(
        (success) => {
          this.emitirLogin.emit(true);
          this.router.navigate(['/home']);
          this.resgatarDadosEmpresa();
        }).catch(
        (err) => {
          console.log(err);
          alert("E-mail ou Senha inválida");
          console.log("Erro");
        })
    } else {
      alert("E-mail ou Senha inválida");
    }
  }

  logout() {
    this.af.auth.logout();
    console.log('logged out');
    this.emitirLogin.emit(false);
    //this.empresa = undefined;
    this.router.navigateByUrl('/home');
  }

  onSubmitCadastrar(formData) {
    //console.log("onSubmit");
    //console.log(formData.value.email);
    if (formData.valid) {
      console.log(formData.value);
      //Cria nova empresa no Firebase Auth
      this.af.auth.createUser({
        email: formData.value.email,
        password: formData.value.password
      }).then(
        (success) => {
          this.cadastrarEmpresa(formData.value.nome, formData.value.proprietario, formData.value.contato);
          this.router.navigate(['/home']);
        }).catch(
        (err) => {
          console.log(err);
        })
    }
  }

  cadastrarEmpresa(nome, proprietario, contato) {
    //Cadastrar uma nova empresa
    //Método que adiciona informações extras à empresa
    var uid;
    this.af.auth.subscribe(auth => {
      //Verifica se usuário está logado
      if (auth) {
        uid = auth.uid;
        console.log("Id: " + uid);
        console.log("Nome: " + nome);
        console.log("Prop: " + proprietario);
        console.log("Contato: " + contato);
        //Estrutura do Json armazenada no banco
        this.af.database.object('empresa/' + uid + "/info_empresa").set({
          nome: nome,
          proprietario: proprietario,
          contato: contato
        });
        this.emitirLogin.emit(true);
        this.resgatarDadosEmpresa();
      }
    });
  }

  resgatarDadosEmpresa() {
    console.log("Resgatando Dados");
    var uid;
    var item;
    this.af.auth.subscribe(auth => {
      //Verifica se usuário está logado
      if (auth) {
        uid = auth.uid;
        //console.log('empresa/' + uid + "/info_empresa/");
        //recupera os dados do banco e adiciona à instância da classe
        item = this.af.database.object('empresa/' + uid + "/info_empresa/", { preserveSnapshot: true });
        item.subscribe(snapshot => {
          //console.log("Dados: " + snapshot.val().proprietario),
          this.empresa.setId(uid);
          this.empresa.setNome(snapshot.val().nome),
          this.empresa.setProprietario(snapshot.val().proprietario),
          this.empresa.setContato(snapshot.val().contato)
        });
      }
    });
  }

  getEmpresa() {
    return this.empresa;
  }

  verificarUsuarioLogin(){
    this.af.auth.subscribe(auth => {
      if (auth) {
        console.log("Logado! " + auth.uid );
        this.emitirLogin.emit(true);
        this.resgatarDadosEmpresa();
      }
      
    });
  }

}
