export interface PasswordValidatorPort {
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}
