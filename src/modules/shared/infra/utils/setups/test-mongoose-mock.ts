export const makeChainableMock = (returnValue?: any) => ({
  findOne: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  create: jest.fn().mockReturnValue(returnValue),
  lean: jest.fn().mockReturnValue(returnValue),
});
