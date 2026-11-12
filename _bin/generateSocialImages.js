#!/usr/bin/env node

import puppeteer from 'puppeteer';
import { Cluster } from 'puppeteer-cluster';
import * as fs from 'node:fs';
import path from 'path';
import chromium from "@sparticuz/chromium-min";
import content from '../pages.json' with { type: 'json' };

const templateHtml = fs.readFileSync("./assets/social_image.html", "utf-8");

(async () => {

    var contentPages = [];

    content.forEach((contentPage, index) => {
        contentPages.push({
            'fileName' : (contentPage.fileSlug == 'content' ? 'index' : contentPage.fileSlug) + '.png',
            'fileSlug' : (contentPage.fileSlug == 'content' ? 'index' : contentPage.fileSlug),
            'title' : contentPage.title,
            'description' : contentPage.description ? contentPage.description : ''
        });
    });

    const browser = await puppeteer.launch({ headless: true });

    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: 2,
        puppeteerOptions: {
        headless: true,
        },
    });

    cluster.on('taskerror', (err, data) => console.error(err));

    await cluster.task(async ({ page, data: contentPage }) => {
        let html = templateHtml.replace('{{ title }}', contentPage.title).replace('{{ description }}', contentPage.description);
        await page.setContent(html, {waitUntil: 'networkidle0'});
        page.setViewport({ width: 1200, height: 630});
        const screenie = await page.screenshot({path: './assets/previews/' + contentPage.fileName});
        console.log(contentPage.fileName);
    });

    contentPages.forEach(contentPage => {
        cluster.queue(contentPage);
    });

    await cluster.idle();
    await cluster.close();
    await browser.close();

    console.log("Images generated successfully");
})();