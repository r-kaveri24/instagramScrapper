import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

chromium.setGraphicsMode = false;

export async function POST(req) {
    try {
        await chromium.font("https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf");

        const { instagramUsername, instagramPassword } = await req.json();

        if (!instagramUsername || !instagramPassword) {
            return new Response(JSON.stringify({ error: "Missing Instagram credentials" }), { status: 400 });
        }

        const browser = await puppeteer.launch({
            args: [...chromium.args],
            defaultViewport: { width: 1280, height: 720 },
            executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
            headless: false, // Change to true for production
        });

        const page = await browser.newPage();

        // **Set a realistic user-agent to reduce bot detection**
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
        );

        // **Go to Instagram login page**
        await page.goto("https://www.instagram.com/accounts/login/", { waitUntil: "networkidle2" });

        // **Log in using provided credentials**
        await page.type('input[name="username"]', instagramUsername, { delay: 100 });
        await page.type('input[name="password"]', instagramPassword, { delay: 100 });
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ waitUntil: "networkidle2" });

        // **Go to user's own profile**
        const profileURL = `https://www.instagram.com/${instagramUsername}/`;
        await page.goto(profileURL, { waitUntil: "networkidle2" });

        // **Ensure meta tag exists before extraction**
        const metaExists = await page.$('meta[property="og:description"]');
        let descriptionContent = metaExists
            ? await page.$eval('meta[property="og:description"]', el => el.getAttribute('content'))
            : "Meta tag not found";

        console.log("Extracted Meta:", descriptionContent);

        await browser.close();

        // **Extract numbers using regex**
        const counts = descriptionContent?.match(/([\d,.]+)\sFollowers.*?([\d,.]+)\sFollowing.*?([\d,.]+)\sPosts/i);

        const followers = counts?.[1] || "Unknown";
        const following = counts?.[2] || "Unknown";
        const posts = counts?.[3] || "Unknown";

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
        console.error("Scraping Error:", error.message);
        return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}