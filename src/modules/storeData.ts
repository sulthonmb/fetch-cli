import { join } from 'path';
import { homedir } from 'os';
import { promises as fsPromises } from 'fs';

interface IData {
    [key: string]: string;
}

export default class StoreData {
    private static instance: StoreData;
    private appName: string;
    private dataFilePath: string;
    private data: IData | null = null;

    constructor(appName: string) {
        this.appName = appName;
        this.dataFilePath = join(homedir(), `.${this.appName}`, `data-${this.appName}.json`);
        
        this.init();
    }

    private async init(): Promise<void> {
        const dataDir = join(homedir(), `.${this.appName}`);
        try {
            await fsPromises.mkdir(dataDir, { recursive: true });
            this.data = await this.readData();
        } catch (error) {
            throw new Error('Error initializing data store: ' + error);
        }
    }

    public static getInstance(appName: string): StoreData {
        if (!StoreData.instance) {
            StoreData.instance = new StoreData(appName);
        }
        return StoreData.instance;
    }

    public async readData(): Promise<IData> {
        try {
            if (await fsPromises.stat(this.dataFilePath)) {
                const data = await fsPromises.readFile(this.dataFilePath, 'utf8');
                return JSON.parse(data);
            }

        } catch (error) {
            console.error('Error reading data file:', error);
        }
        return {};
    }
  
    public async writeData(data: IData): Promise<void> {
        try {
            await fsPromises.writeFile(this.dataFilePath, JSON.stringify(data, null, 2));
            this.data = data;
        } catch (error) {
            console.error('Error writing data file:', error);
        }
    }

    public getData(): IData {
        return this.data || {};
    }
}
