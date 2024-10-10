import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  moduleFileExtensions: ['ts', 'js', 'json', 'html'],
  // testRegex: '.*\\.spec\\.ts$',
  testMatch: ['<rootDir>/test/**/*.spec.ts'],
  coverageReporters: ['html', 'text', 'json', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.ts',
    // Exclude specific files and folders from coverage
    '!src/**/*.{module,dto,entity,model,enum,config,test,spec,mock,type,index,constant}.ts',
    '!src/{cluster,main,index,grpc.options}.ts',
    '!**/app/**',
    '!src/modules/infra/**',
    '!src/**/common/**',
    '!src/db/**',
    '!src/user/dto/**',
    '!src/user/entity/**',
    // Add additional folders or files to exclude here
    '!src/seed/**', // Add this to exclude the folder
    '!src/shared/**', // Add another folder
    '!src/casl/**', 
    '!src/auth/**', 
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
