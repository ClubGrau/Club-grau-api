import { Employee } from './Employee';

describe('Employee Entity', () => {
  it('should be defined', () => {
    const employee = new Employee();
    expect(employee).toBeDefined();
  });
});
