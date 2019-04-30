import * as baseGlob from 'glob';
import * as util from 'util';
import { PromisifyType } from './type';

export const glob: PromisifyType<string> = util.promisify(baseGlob);
