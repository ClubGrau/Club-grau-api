export interface FindActiveEmployeeByEmail {
  isExist: (email: string) => Promise<boolean>;
}
