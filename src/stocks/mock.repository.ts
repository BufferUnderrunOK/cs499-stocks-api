import { MongoRepository } from 'typeorm';

/**
 * Kern, K. (2019, March) Inject TypeORM repository into NestJS service for mock data testing.
 * Retrieved from https://stackoverflow.com/a/55366343
 */
// @ts-ignore
export const repositoryMockFactory: () => MockType<MongoRepository<any>> = jest.fn(() => ({
    findOne: jest.fn(entity => entity),
    create: jest.fn(entity => entity),
    findOneAndUpdate: jest.fn(entity => entity),
    findOneAndDelete: jest.fn(entity => entity)
}));

export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
};

/** end citation */