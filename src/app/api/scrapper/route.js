import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

chromium.setGraphicsMode = false;

export async function POST(req) {
    try {
        await chromium.font("https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf");

        const browser = await puppeteer.launch({
            args: [...chromium.args],
            defaultViewport: { width: 1280, height: 720 },
            executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
            headless: "shell",
        });

        const { instagramUrl } = await req.json();
        if (!instagramUrl) {
            return new Response(JSON.stringify({ error: "Please check the username" }), { status: 400 });
        }

        const page = await browser.newPage();
        await page.goto(instagramUrl, { waitUntil: "networkidle2" });

        // Dismiss login popup if present
        const loginPopupSelector = 'button[tabindex="0"]';
        const popupExists = await page.$(loginPopupSelector);
        if (popupExists) {
            await page.click(loginPopupSelector);
            await page.waitForTimeout(2000);
        }

        // Extract the content of the og:description meta tag
        const descriptionContent = await page.$eval(
            'meta[property="og:description"]',
            el => el.getAttribute('content')
        );

        await browser.close();

        // Extract the numbers using regex
        const counts = descriptionContent?.match(/([\d,.]+)\sFollowers.*?([\d,.]+)\sFollowing.*?([\d,.]+)\sPosts/i);

        const followers = counts?.[1] || null;
        const following = counts?.[2] || null;
        const posts = counts?.[3] || null;

        return new Response(
            JSON.stringify({
                followers,
                following,
                posts,
                rawDescription: descriptionContent,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
