import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const videoQueue = JSON.parse(readFileSync('./captions.json', 'utf8'));

async function autoPost() {
  console.log('🤖 Starting social media bot...');
  
  const browser = await puppeteer.launch({
    headless: false, // Changed to false to see what's happening
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080']
  });

  try {
    const nextVideo = videoQueue.videos.find(v => !v.posted);
    
    if (!nextVideo) {
      console.log('✅ All videos posted!');
      return;
    }

    console.log(`📹 Processing: ${nextVideo.drive_link}`);
    
    // Check if it's a placeholder
    if (nextVideo.drive_link.includes('FILE_ID_')) {
      console.log('❌ SKIPPING: Placeholder file ID');
      nextVideo.posted = true;
      nextVideo.skipped = true;
      writeFileSync('./captions.json', JSON.stringify(videoQueue, null, 2));
      return;
    }

    // POST TO INSTAGRAM
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    console.log('🔐 Logging into Instagram...');
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // Login
    await page.type('input[name="username"]', process.env.INSTAGRAM_USERNAME);
    await page.type('input[name="password"]', process.env.INSTAGRAM_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(8000);
    
    // Check if login successful
    const currentUrl = page.url();
    if (currentUrl.includes('accounts/login')) {
      console.log('❌ Login failed! Check credentials.');
      return;
    }
    
    console.log('✅ Login successful!');
    
    // Go to create post
    console.log('📤 Creating new post...');
    await page.goto('https://www.instagram.com/create/select/', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // Since we can't directly upload from Google Drive links in Instagram,
    // we'll simulate the process and show what WOULD happen
    
    console.log('🎬 Video would be uploaded from:', nextVideo.drive_link);
    console.log('📝 Caption would be:', nextVideo.caption);
    console.log('✅ SIMULATION: Post would be live now!');
    
    // In real implementation, we would:
    // 1. Download video from Google Drive
    // 2. Upload to Instagram
    // 3. Add caption
    // 4. Publish
    
    // For now, mark as posted for testing
    nextVideo.posted = true;
    nextVideo.posted_at = new Date().toISOString();
    writeFileSync('./captions.json', JSON.stringify(videoQueue, null, 2));
    
    console.log('✅ Marked as posted in queue!');
    
    await page.waitForTimeout(3000);
    await page.close();
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

autoPost();
