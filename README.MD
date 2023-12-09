# Fetch Web CLI with Typescript and Commander.js

## Overview

A command-line interface (CLI) tool with TypeScript and Commander.js to effortlessly fetch web content.

## Features

- Easy-to-use CLI for fetching web content.
- Multiple web pages
- Download all assets web pages
- Metadata web pages
- Built with TypeScript for type safety.
- Cheerio for intuitive command parsing.
- Powered by Commander.js, the complete solution for node.js command-line interfaces.

## Installation

Clone this repository:
```bash
git clone https://github.com/sulthonmb/fetch-cli.git
```

Install and build
```bash
npm install
npm run build
```

Install CLI
```bash
npm i -g
```

## Installation with Docker
Build
```bash
docker build -t fetch-cli .
```
## Usage

```bash
fetch https://google.com https://autify.com  --metadata
```

## Usage with Docker
```bash
docker run -it fetch-cli https://google.com https://autify.com  --metadata    
```

## Contributing

Feel free to contribute to this project by opening issues or creating pull requests. Your contributions are highly appreciated!
