import { promises as fsPromises } from 'fs';
import * as cheerio from 'cheerio';
import axios from 'axios';
import StoreData from './storeData';
import { join } from 'path';
import { homedir } from 'os';
import path from 'path';

interface IOptions {
    metadata: boolean;
}

export default class WebPages {
    private url: string;
    private appName: string;
    private storeData: StoreData;
    private domain: string;
    private dataDir: string;

    constructor(url: string, appName: string, storeData: StoreData) {
        this.url = url;
        this.appName = appName;
        this.storeData = storeData;
        const parsedUrl = new URL(this.url);
        this.domain = parsedUrl.hostname;
        this.dataDir = join(homedir(), `.${this.appName}`, this.domain);
        
        this.init();
    }

    private async init(): Promise<void> {
        try {
            await fsPromises.mkdir(this.dataDir, { recursive: true });
        } catch (error) {
            console.log('Error load ' + this.domain);
        }
    }

    public async download(options: IOptions): Promise<void> {
        const metadata = options.metadata ? true : false;

        try {
            const response = await axios.get(this.url);
            const $ = cheerio.load(response.data);

            const elementsToModify = $('img, link[rel="stylesheet"], link[rel="icon"], script');
            await Promise.all(
                elementsToModify.map(async (index, element) => {
                    const assetUrl = $(element).attr('src') || $(element).attr('href');
            
                    if (assetUrl) {
                        const assetResponse = await axios.get(assetUrl, { responseType: 'arraybuffer' });
            
                        const assetFileName = path.basename(assetUrl).split('?')[0];
                        const assetFilePath = path.join(this.dataDir, assetFileName);
                        await fsPromises.writeFile(assetFilePath, assetResponse.data);
            
                        // Modify the attribute based on the element type
                        if ($(element).is('img, script')) {
                            $(element).attr('src', assetFilePath);
                            $(element).attr('srcset', assetFilePath);
                        } else if ($(element).is('link[rel="stylesheet"]') || $(element).is('link[rel="icon"]')) {
                            $(element).attr('href', assetFilePath);
                        }
                    }
                })
            );

            const data = this.storeData.getData();
            data[this.domain] = String(new Date().toUTCString().replace('GMT', 'UTC'));
            this.storeData.writeData(data);    

            await fsPromises.writeFile(`${this.domain}.html`, $.html());

            if (metadata) {
                const countImages = $('img').length;
                const countLinks = $('a').length;
    
                const data = this.storeData.getData();
                console.log('site: ', this.domain);
                console.log('num_links: ', countLinks);
                console.log('images: ', countImages);
                console.log('last_fetch: ', data[this.domain]);
            }

        } catch (error) {
            console.log('Error download ' + this.domain);
        }
    }
}