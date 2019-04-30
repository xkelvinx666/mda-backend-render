import * as template from 'art-template';
import * as _ from 'lodash';
import { BaseTemplate } from './base.template';
import { TemplateCompileInterface } from './type';

/**
 * 注册art-template模版引擎为service
 * 构造时注入模版方法
 */
export class ArtTemplate extends BaseTemplate {
  templateEngine = template;
  constructor() {
    super();
    // 为模版引擎注入方法
    this.templateEngine.defaults.imports.camCase = _.camelCase;
    this.templateEngine.defaults.imports.capitalize = _.capitalize;
    this.templateEngine.defaults.imports.toJson = (val: object) => {
      let json = JSON.stringify(val, null, '\t');
      // 移除括号和前后空格
      json = json.substring(1, json.length - 1).trim();
      // 移除key的双引号
      json = _.replace(json, /"(\w+)"(\s*:\s*)/g, '$1$2');
      // 双引号转为单引号
      json = _.replace(json, /"/g, `'`);
      return json;
    };
  }

  compile(compileOption: TemplateCompileInterface): string {
    if (compileOption.source) {
      return this.templateEngine.render(
        compileOption.source,
        compileOption.data,
      );
    } else if (compileOption.path) {
      return this.templateEngine(compileOption.path, compileOption.data);
    }
  }
}
