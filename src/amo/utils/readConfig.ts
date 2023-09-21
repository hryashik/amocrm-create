import * as fs from 'fs';
import { ConfigType } from '../types/configType';

export async function readConfig(): Promise<ConfigType> {
   try {
      const configPath = './config/config.json';
      const data = (await fs.promises.readFile(configPath)).toString();
      return JSON.parse(data);
   } catch (error) {
      throw new Error('не могу прочитать конфиг');
   }
}
