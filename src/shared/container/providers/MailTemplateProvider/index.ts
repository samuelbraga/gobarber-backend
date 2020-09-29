import { container } from 'tsyringe';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/modules/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

const providers = {
  handleBars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handleBars,
);
