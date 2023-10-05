// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import puppeteer, { Page } from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { NextApiRequest, NextApiResponse } from 'next';

const findButton = async (page: Page, messageId: string) => {
  const divElement = await page.$(`#message-accessories-${messageId}`);
  if (divElement) {
    const buttons = await divElement.$$("button");

    if (buttons) {
      for (const button of buttons) {
        const innerText = await button.evaluate((div) =>
          div?.textContent?.trim() || ''
        );
        if (innerText.includes("Vary (Region)")) {
          button.click();
          return true;
        }
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}

const findIframe = async (page: Page) => {
  const frames = page.frames();

  for (const frame of frames) {
    // 获取 iframe 的 src 属性
    const src = await frame.evaluate(() => window.location.href);

    if (src.startsWith("https://936929561302675456.discordsays.com")) {
      return src;
    }
  }

  return null;
}

const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getIframeAddress = async (messageId: string) => {
  const browser = process.env.PUPPETEER_CHROME_BIN ? await puppeteer.launch({
    executablePath: process.env.PUPPETEER_CHROME_BIN,
    headless: 'new',
    args: ['--no-sandbox', '--headless', '--disable-gpu'],
  }) : await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });
  const page = await browser.newPage();

  const bypassLocalStorageOverride = (page: Page) =>
    page.evaluateOnNewDocument(() => {
      // Preserve localStorage as separate var to keep it before any overrides
      let __ls = localStorage;

      // Restrict closure overrides to break global context reference to localStorage
      Object.defineProperty(window, "localStorage", {
        writable: false,
        configurable: false,
        value: __ls,
      });
    });

  // Calling function before storing token into Discord so that errors don't occur
  bypassLocalStorageOverride(page);

  await page.goto("https://discord.com/app");

  // Setting token into Discord Local Storage (Don't worry it's not being sent/stored anywhere, this is how Discord does it)
  await page.evaluate((token) => {
    localStorage.setItem("token", `"${token}"`);
  }, process.env.SALAI_TOKEN);

  await page.goto(
    `https://discord.com/channels/${process.env.SERVER_ID}/${process.env.CHANNEL_ID}`
  );

  let retried = 0;
  while (await findButton(page, messageId) === false && retried < 10) {
    await timeout(1000);
    retried++;
  }

  retried = 0;
  let result = null;
  while (!result && retried < 10) {
    await timeout(1000);
    result = await findIframe(page)
    retried++;
  }

  await browser.close();

  return result
};

type ResponseData = {
  url: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { msgId } = req.body;
  console.log("variation.handler", msgId);
  if (!msgId) {
    res.status(500).json({ url: '' })
    return
  }
  const url = await getIframeAddress(msgId);
  console.log("variation.url", url);

  if (!url) {
    res.status(500).json({ url: '' })
  } else {
    res.status(200).json({ url })
  }
}
