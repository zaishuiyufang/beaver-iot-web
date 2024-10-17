import { camelCase } from 'lodash-es';
import { isFileName } from '@milesight/shared/src/utils/tools';

const modules = (async () => {
    const getModuleFiles = async (modules: ModuleType, suffix?: string) => {
        let bucket = {};
        for await (const path of Object.keys(modules)) {
            const module = await modules[path]();

            const component = module.default;
            const [, folder] = path?.split('/') || [];
            if (!folder || folder in bucket || isFileName(folder)) continue;

            const name = camelCase(folder) + (suffix || '');
            bucket = { ...bucket, [name]: component };
        }
        return bucket;
    };

    const configureModules = import.meta.glob('../plugins/*/configure/index.tsx');
    const viewModules = import.meta.glob('../plugins/*/view/index.tsx');

    const configFiles = await getModuleFiles(configureModules, 'Config');
    const viewFiles = await getModuleFiles(viewModules, 'View');
    return { ...configFiles, ...viewFiles };
})();

export default modules;
