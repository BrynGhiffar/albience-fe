import { Configuration } from "../commons/types";
import path from 'path';
import fs from 'fs';

const configJson = path.join(path.join(process.cwd(), 'data'), 'config.json');

export function setSeasonalTagging(isSeasonalTagging: boolean) {
    const config: Configuration = JSON.parse(fs.readFileSync(configJson, "utf-8"));
    config.seasonalTagging = isSeasonalTagging;
    fs.writeFileSync(configJson, JSON.stringify(config, null, 2));
}

export function getConfiguration(): Configuration {
    const config: Configuration = JSON.parse(fs.readFileSync(configJson, "utf-8"));
    return config;
}