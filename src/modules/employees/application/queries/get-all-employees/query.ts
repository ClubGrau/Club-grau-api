export class GetAllEmployeesQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
