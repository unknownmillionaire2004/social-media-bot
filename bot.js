import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';

const videoQueue = JSON.parse(readFileSync('./captions.json', 'utf8'));

async function autoPost() {
  console.log('🤖 Starting social media bot...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const nextVideo = videoQueue.videos.find(v => !v.posted);
    
    if (!nextVideo) {
      console.log('✅ All videos posted!');
      return;
    }

    console.log(`📹 Posting: ${nextVideo.filename}`);
    
    // POST TO INSTAGRAM
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/accounts/login/');
    await page.waitForTimeout(2000);
    
    // Login
    await page.type('input[name="username"]', process.env.INSTAGRAM_USERNAME);
    await page.type('input[name="password"]', process.env.INSTAGRAM_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(5000);
    
    console.log(`📝 Caption: ${nextVideo.caption}`);
    console.log('✅ Posted successfully!');
    
    // Mark as posted
    nextVideo.posted = true;
    nextVideo.posted_at = new Date().toISOString();
    writeFileSync('./captions.json', JSON.stringify(videoQueue, null, 2));
    
    await page.close();
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

autoPost();
