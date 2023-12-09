#! /usr/bin/env node

import { Command } from "commander";
import figlet from "figlet";
import StoreData from './modules/storeData';
import WebPages from "./modules/webPages";

interface IOptions {
    metadata: boolean;
}

const program = new Command();
const storeData = StoreData.getInstance('fetch');

console.log(figlet.textSync("Fetch"));

program
  .version("1.0.0")
  .description("An CLI for download web pages")
  .argument('<urls...>', 'Urls')
  .option("--metadata", "Record metadata web pages")
  .action((urls, options: IOptions) => {
    for (const url of urls) {
        const webPages = new WebPages(url, 'fetch', storeData);
        webPages.download(options);
    }

    console.log('Fetch web successfully.');
  });

program.parse();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}