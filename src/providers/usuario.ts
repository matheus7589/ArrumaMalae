
export class Usuario{

  private nome: string;
  private sobrenome: string;
  private email: string;
  private userID: string;

  constructor(){}

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

  public getNome(): string{
    return this.nome;
  }

  public getSobreNome(): string{
    return this.sobrenome;
  }

  public getEmail(): string{
    return this.email;
  }

  public getUserID(): string{
    return this.userID;
  }

}
