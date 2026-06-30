export namespace SigninModel {
  export interface RequestDto {
    email: string;
    password: string;
  }

  export interface ResponseDto {
    token: string;
  }
}
