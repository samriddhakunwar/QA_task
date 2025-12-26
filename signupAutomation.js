const puppeteer = require('puppeteer');

// Configuration
const URL = "https://authorized-partner.vercel.app/";
// Generate unique email using timestamp
const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
const USER_DATA = {
    firstName: "Test",
    lastName: "User",
    email: `testuser_${timestamp}@example.com`,
    password: "Test@12345"
};

// Helper function to wait
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Main automation function
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized'],
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
// Create a new page
    const page = await browser.newPage();
// Navigate to the URL
    try {

        await page.goto(URL, { waitUntil: 'networkidle2' });

// Click on the signup button/link
        await page.waitForSelector('a, button');
        const buttons = await page.$$('a, button');
        let clicked = false;
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('Get Started') || text.includes('Join')) {
                await btn.click();
                clicked = true;
                break;
            }
        }
        if (!clicked) throw new Error('Signup button not found');

        await sleep(1000);


        await page.waitForSelector('form');

        // First Name
        const firstNameField = await page.$('input[name="firstName"], input[placeholder*="First"]');
        if (firstNameField) await firstNameField.type(USER_DATA.firstName);
        else console.log('⚠ First Name field not found, skipping');

        // Last Name
        const lastNameField = await page.$('input[name="lastName"], input[placeholder*="Last"]');
        if (lastNameField) await lastNameField.type(USER_DATA.lastName);
        else console.log('⚠ Last Name field not found, skipping');

        // Email
        const emailField = await page.$('input[name="email"], input[placeholder*="Email"]');
        if (emailField) await emailField.type(USER_DATA.email);
        else throw new Error('Email field not found');

        // Password
        const passwordField = await page.$('input[name="password"]:not([name="confirmPassword"]), input[placeholder*="Password"]:not([placeholder*="Confirm"])');
        if (passwordField) await passwordField.type(USER_DATA.password);
        else throw new Error('Password field not found');

        // Confirm Password
        const confirmPasswordField = await page.$('input[name="confirmPassword"], input[placeholder*="Confirm"]');
        if (confirmPasswordField) await confirmPasswordField.type(USER_DATA.password);
        else console.log('⚠ Confirm Password field not found, skipping');

        // Submit form
        const submitButton = await page.$('button[type="submit"]');
        if (submitButton) await submitButton.click();
        else throw new Error('Submit button not found');

        await sleep(1000);
// Handle optional checkbox (e.g., terms and conditions)
        try {
            const checkbox = await page.$('input[type="checkbox"]');
            if (checkbox) await checkbox.click();
            else console.log('⚠ Checkbox not present, skipping');
        } catch {
            console.log('⚠ Checkbox not present, skipping');
        }

        // Final submit if present
        const finalSubmit = await page.$('button[type="submit"]');
        if (finalSubmit) await finalSubmit.click();
// Wait for navigation or confirmation
        try {
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
            console.log('Signup automation completed successfully (page navigation detected)');
        } catch {
            const msgEl = await page.$('div, p, span');
            if (msgEl) {
                const text = await page.evaluate(el => el.textContent, msgEl);
                console.log('✅ Signup completed, found element text:', text.trim());
            } else {
                throw new Error('Signup might have failed: no confirmation detected');
            }
        }

    } catch (err) {
        console.error('Automation failed:', err);
        await page.screenshot({ path: 'signup_failure.png' });
    } finally {
        await browser.close();
    }
})();
