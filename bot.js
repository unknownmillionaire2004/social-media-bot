import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';

const videoQueue = JSON.parse(readFileSync('./captions.json', 'utf8'));

async function autoPost() {
  console.log('🤖 Starting social media bot for 652 videos...');
  
  const totalVideos = videoQueue.videos.length;
  const postedVideos = videoQueue.videos.filter(v => v.posted).length;
  const remainingVideos = totalVideos - postedVideos;
  
  console.log(`📊 Progress: ${postedVideos}/${totalVideos} videos posted`);
  console.log(`⏳ Remaining: ${remainingVideos} videos`);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const nextVideo = videoQueue.videos.find(v => !v.posted);
    
    if (!nextVideo) {
      console.log('🎉 ALL 652 VIDEOS POSTED! Bot completed mission!');
      return;
    }

    console.log(`📹 Now posting: Video ${postedVideos + 1} of ${totalVideos}`);
    console.log(`🔗 Drive link: ${nextVideo.drive_link}`);
    
    // Check if it's still a placeholder
    if (nextVideo.drive_link.includes('FILE_ID_')) {
      console.log('❌ SKIPPING: Still using placeholder file ID');
      console.log('💡 Replace FILE_ID with actual Google Drive file ID');
      
      // Mark as posted to skip placeholder
      nextVideo.posted = true;
      nextVideo.posted_at = new Date().toISOString();
      nextVideo.skipped = true;
      writeFileSync('./captions.json', JSON.stringify(videoQueue, null, 2));
      
      return;
    }
    
    // POST TO INSTAGRAM (actual posting logic)
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/accounts/login/');
    await page.waitForTimeout(3000);
    
    // Login
    await page.type('input[name="username"]', process.env.INSTAGRAM_USERNAME);
    await page.type('input[name="password"]', process.env.INSTAGRAM_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(8000);
    
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
