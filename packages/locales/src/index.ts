import { LocaleHelper } from './helper';
import { LANGUAGE } from './types';

export * from './types';
export default new LocaleHelper({ defaultLanguage: LANGUAGE.EN });
