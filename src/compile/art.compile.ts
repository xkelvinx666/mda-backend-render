import { ModelsInterface } from './type';
import { ArtTemplate } from '../template/art.template';
import { BaseCompile } from './base.compile';
import axios from 'axios';
import * as _ from 'lodash';

export class ArtCompile extends BaseCompile<ModelsInterface, ArtTemplate> {
  protected matchKey;
  protected matchSuffix;
  protected template;

  constructor() {
    super();
    this.matchKey = 'model';
    this.matchSuffix = 'art';
    this.template = new ArtTemplate();
  }

  // @ts-ignore
  public async compile() {
    const templatePath: string = process.argv[3];
    const projectId: number = _.toNumber(process.argv[4]);
    const isDeleteTemplate: boolean = process.argv[5] === 'true';
    const { data } = await axios.get(`/api/projects/${projectId}/models/json`, {
      proxy: {
        host: '172.17.0.1',
        port: 3001,
      },
    });
    return super.compile(templatePath, data, isDeleteTemplate);
  }
}
