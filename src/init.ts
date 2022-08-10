import * as fs from 'fs';
import * as path from 'path';

export const getInjectionString = () => {
  const injectionPath = path.resolve(__dirname, 'injection.bundle.js');
  const injection = fs.readFileSync(injectionPath, { encoding: 'utf8' });
  return injection;
};
