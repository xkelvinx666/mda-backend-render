import { ModelsInterface } from './type';
import { ArtTemplate } from '../template/art.template';
import { BaseCompile } from './base.compile';

export abstract class ArtCompile extends BaseCompile<
  ModelsInterface,
  ArtTemplate
> {
  protected matchKey;
  protected matchSuffix;
  protected template;

  protected constructor() {
    super();
    this.matchKey = 'model';
    this.matchSuffix = 'art';
    this.template = new ArtTemplate();
  }
}
