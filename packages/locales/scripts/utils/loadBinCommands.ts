/* eslint-disable import/no-dynamic-require */
import { join } from 'path';
import { Command } from 'commander';
import { get } from 'lodash';

/**
 * @description 批量加载命令
 */
export function loadBinCommands(program: Command, config: ConfigType) {
    const { importCommand } = require(join(__dirname, '../commands/import.ts'));
    const { exportCommand } = require(join(__dirname, '../commands/export.ts'));
    const commonConfig = get(config, 'common');

    // eslint-disable-next-line
    importCommand(program, Object.assign({}, commonConfig, config['import']));
    // eslint-disable-next-line
    exportCommand(program, Object.assign({}, commonConfig, config['export']));
}
