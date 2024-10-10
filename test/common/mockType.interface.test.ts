import { Repository } from 'typeorm';
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};

// Create a generic mock repository
export const InjectRepoMock = <T>(mockData: T[]): MockType<Repository<T>> => ({
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  findBy: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([mockData, mockData.length]),
  }),
});
