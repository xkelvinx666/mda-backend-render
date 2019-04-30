import { TemplateCompileInterface } from './type';

export abstract class BaseTemplate {
  protected templateEngine: object;
  abstract compile(compileOption: TemplateCompileInterface): string;
}
