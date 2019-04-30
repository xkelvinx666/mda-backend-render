import * as path from 'path';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
import del from 'del';
import { glob } from '../util/promisify/glob';
import { ModelsInterface } from './type';
import { BaseTemplate } from '../template/base.template';

export abstract class BaseCompile<
  ModelType extends ModelsInterface,
  TemplateType extends BaseTemplate
> {
  protected handledFiles: string[] = [];
  protected matchKey = 'model';
  protected matchSuffix = '';
  protected template: TemplateType;

  /**
   * 含有model名称的文件夹按model批量复制，并对内部模板传入编译model数据进行编译
   * 文件夹
   */
  private handleDic(
    dics: string[],
    datas: ModelType[],
  ): Array<Promise<any[][]>> {
    return dics.map(async dic => {
      // 处理文件夹下的模版文件
      const modelFileInDicGlob = path.join(dic, `*.${this.matchSuffix}`);
      const modelFileInDic = await glob(modelFileInDicGlob);
      this.handledFiles = this.handledFiles.concat(modelFileInDic);
      return await Promise.all(
        datas.map(async modelData => {
          // 处理复制后的文件夹下的模版文件
          const target = dic.replace(this.matchKey, `${modelData.name}`);
          await fs.copy(dic, target);
          const targetFileGlob = path.join(target, '*.art');
          const targetFiles: string[] = await glob(targetFileGlob);
          this.handledFiles = this.handledFiles.concat(targetFiles);
          return await Promise.all(
            targetFiles.map(async targetFile => {
              let modelTargetFile = targetFile;
              this.handledFiles.push(modelTargetFile);
              const result = this.template.compile({
                path: path.resolve(modelTargetFile),
                data: modelData,
              });
              modelTargetFile = modelTargetFile.replace(
                path.extname(modelTargetFile),
                '',
              );
              this.handledFiles.push(modelTargetFile);
              return await fs.writeFile(modelTargetFile, result);
            }),
          );
        }),
      );
    });
  }

  /**
   * 含有model名称的文件按model批量复制，并对内部模板传入编译model数据进行编译
   * 文件
   */
  private handleFile(
    modelFiles: string[],
    modelDatas: ModelsInterface[],
  ): Array<Promise<any[][]>> {
    this.handledFiles = this.handledFiles.concat(modelFiles);
    return modelFiles.map((targetFile: string) => {
      return Promise.all(
        modelDatas.map(async modelData => {
          let modelTargetFile = targetFile;
          const result = this.template.compile({
            path: path.resolve(modelTargetFile),
            data: modelData,
          });
          const modelTargetFileBaseName = path.basename(modelTargetFile);
          // 只替换basename部分
          modelTargetFile = modelTargetFile.replace(
            modelTargetFileBaseName,
            modelTargetFileBaseName.replace(this.matchKey, `${modelData.name}`),
          );
          modelTargetFile = modelTargetFile.replace(
            path.extname(modelTargetFile),
            '',
          );
          return await fs.writeFile(modelTargetFile, result);
        }),
      );
    });
  }

  public compile(
    templatePath: string,
    models: ModelType[],
    isDeleteTemplate: boolean = true,
  ) {
    return Promise.all([
      glob(
        path.join(templatePath, `**/**/${this.matchKey}.*.${this.matchSuffix}`),
      ),
      glob(path.join(templatePath, `**/${this.matchKey}`)),
      glob(path.join(templatePath, `**/*.${this.matchSuffix}`)),
    ]).then(async ([modelFiles, dics, templateFiles]) => {
      // 已处理过的文件

      const dicPromiseResults = this.handleDic(dics, models);
      const modelPromiseResults = this.handleFile(modelFiles, models);

      /**
       * 含有model名称的文件按model批量复制，并对内部模板传入编译所有models数据进行编译
       * 文件
       * 过滤掉上述已处理的文件
       */
      return Promise.all([...dicPromiseResults, ...modelPromiseResults]).then(
        async () => {
          templateFiles = _.difference(templateFiles, this.handledFiles);
          this.handledFiles = this.handledFiles.concat(templateFiles);
          await Promise.all(
            templateFiles.map(async (targetFile: string) => {
              const result = this.template.compile({
                path: path.resolve(targetFile),
                data: models,
              });
              targetFile = targetFile.replace(path.extname(targetFile), '');
              return fs.writeFile(targetFile, result);
            }),
          );
          isDeleteTemplate && del.sync(this.handledFiles);
        },
      );
    });
  }
}
