
export class Usuario{

  private nome: string;
  private sobrenome: string;
  private email: string;
  private userID: string;

  constructor(nome: string, sobrenome: string, email: string, id: string){
    this.nome = nome;
    this.sobrenome = sobrenome;
    this.email = email;
    this.userID = id;
  }

  public setNome(nome: string){
    this.nome = nome;
  }

  public setSobreNome(sobrenome: string){
    this.sobrenome = sobrenome;
  }

  public setEmail(email: string){
    this.email = email;
  }

  public setUserID(id: string){
    this.userID = id;
  }

}
