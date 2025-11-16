import json

# AI News Reporting captions - we'll rotate through these
captions = [
    "Breaking: AI transforms news reporting forever! 🚀 #AInews #TechReporting #MediaRevolution #ArtificialIntelligence",
    "How AI is changing journalism as we know it! 📰 #AIjournalism #DigitalMedia #NewsAutomation #TechNews",
    "AI reporters - threat or opportunity for journalists? 🤖 #AIReporter #JournalismTech #MediaFuture #NewsAI",
    "Exclusive: Inside AI-powered newsrooms! 🏢 #AINewsroom #SmartMedia #DigitalTransformation #NewsTech",
    "AI writes news faster than humans! ⚡ #NewsAutomation #FastMedia #AIWriting #ContentCreation",
    "AI in broadcast journalism revolution! 📺 #AIBroadcast #VideoNews #MediaAI #FutureMedia",
    "How algorithms control your news feed! 🧠 #AlgorithmNews #AICuration #PersonalizedNews #DigitalJournalism",
    "AI vs Human reporters - the ultimate showdown! 🥊 #AIvsHuman #ReportingFuture #JournalismDebate",
    "Essential AI tools for modern journalists! 🛠️ #AINewsTools #JournalismTech #MediaTools #DigitalJournalist",
    "The rise of virtual AI news anchors! 🎥 #AIAnchor #VirtualNews #DigitalAnchor #FutureNews",
    "AI can detect fake news instantly! ✅ #AIFactCheck #FakeNewsDetection #TruthAI #MediaVerification",
    "AI creates personalized news for everyone! 🎯 #PersonalizedNews #AICuration #SmartNews #CustomMedia",
    "The ethical dilemma of AI in news! ⚠️ #AIEthics #NewsBias #AlgorithmBias #MediaEthics",
    "AI-generated video news is here! 🎬 #AIVideo #GeneratedNews #VideoAI #DigitalContent",
    "Global news agencies adopting AI! 🌍 #GlobalAI #NewsAgencies #InternationalMedia #AIAdoption"
]

def create_captions_template():
    videos = []
    
    # Create 30 entries to start (you can increase later)
    for i in range(30):
        caption_index = i % len(captions)
        videos.append({
            "drive_link": f"https://drive.google.com/drive/folders/1w4SnkR8ucSTwwqLjn61Q2etcZuQugYcB?usp=drive_link",
            "caption": captions[caption_index],
            "posted": False
        })
    
    return {"videos": videos}

# Create the file
print("🤖 Creating captions template...")
template = create_captions_template()

# Save to captions.json
with open('captions.json', 'w') as f:
    json.dump(template, f, indent=2)

print("✅ SUCCESS: captions.json created with 30 video slots!")
print("📝 Next: Replace REPLACE_WITH_FILE_ID_1, REPLACE_WITH_FILE_ID_2, etc.")
print("🔗 with your actual Google Drive file IDs")
