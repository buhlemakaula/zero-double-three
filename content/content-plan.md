# AI, Made Simple — 30 Day Instagram Content Plan

Series brand: educational carousels teaching AI and Claude in plain language, in the Buhle visual identity (ink, bone, orange, Anton and Urbanist, grain).

Goal: aggressive but honest growth through saves and shares. Educational carousels are the highest save format on Instagram, and saves plus shares are the signals the algorithm rewards most. Nobody can guarantee 10K followers or virality; this plan maximises the odds with daily posting, one repeatable format, strong hooks and consistent branding.

## The formula every post follows

1. Hook slide: under ten words, one orange accent word, curiosity gap.
2. Five to seven content slides: one idea per slide, plain language, copyable prompt examples in the orange-edged box.
3. CTA slide: save this, share it, follow for tomorrow's topic (open loop).
4. Caption: hook line first (it shows in feed), value summary, one question to drive comments, 10 niche hashtags.

## Posting times (SAST)

- Weekdays 11:00 — peak for educational content (Sprout Social 2026 data).
- Wednesday and Sunday 19:00 — evening learners.
- Saturday 10:00 — light brand quote post to keep the streak.

## Content pillars

- **Claude** (what it is, vs ChatGPT, Claude Code, hidden features)
- **AI basics** (tokens, context windows, hallucinations, agents, myths)
- **Prompts** (formulas, templates people copy and save)
- **Business** (SA small business use cases, WhatsApp, CVs, earning with AI)
- **Story** (built in public: this brand, this exact automation)

## The calendar

| # | Date | Time | Format | Title |
|---|------|------|--------|-------|
| 1 | Mon 13 Jul | 11:00 | Carousel 8 | What is Claude? The AI everyone is quietly switching to |
| 2 | Tue 14 Jul | 11:00 | Carousel 7 | 5 prompts that make AI actually useful |
| 3 | Wed 15 Jul | 19:00 | Carousel 8 | AI words explained like you are five |
| 4 | Thu 16 Jul | 11:00 | Carousel 8 | Claude vs ChatGPT, the honest version |
| 5 | Fri 17 Jul | 11:00 | Carousel 8 | I built my whole brand with AI in one day |
| 6 | Sat 18 Jul | 10:00 | Quote | Make it loud. Keep it clean. |
| 7 | Sun 19 Jul | 19:00 | Carousel 7 | The 3 part prompt formula I use every day |
| 8 | Mon 20 Jul | 11:00 | Carousel | 7 things Claude can do that you did not know |
| 9 | Tue 21 Jul | 11:00 | Carousel | Why AI lies to you (hallucinations) |
| 10 | Wed 22 Jul | 19:00 | Carousel | Turn Claude into your design assistant |
| 11 | Thu 23 Jul | 11:00 | Carousel | Why long AI chats go stupid (context windows) |
| 12 | Fri 24 Jul | 11:00 | Carousel | 6 ways SA small businesses can use AI today |
| 13 | Sat 25 Jul | 10:00 | Quote | Taste is the job now |
| 14 | Sun 26 Jul | 19:00 | Carousel | Learn AI in 30 days, the beginner roadmap |
| 15 | Mon 27 Jul | 11:00 | Carousel | Claude Code explained for non coders |
| 16 | Tue 28 Jul | 11:00 | Carousel | 5 AI myths you probably believe |
| 17 | Wed 29 Jul | 19:00 | Carousel | Never take a vague brief again (client prompts) |
| 18 | Thu 30 Jul | 11:00 | Carousel | Tokens, the currency of AI |
| 19 | Fri 31 Jul | 11:00 | Carousel | I let AI plan my Instagram (this system) |
| 20 | Sat 1 Aug | 10:00 | Quote | Loud ideas. Clean execution. |
| 21 | Sun 2 Aug | 19:00 | Carousel | 10 Claude prompts for students |
| 22 | Mon 3 Aug | 11:00 | Carousel | Why your AI answers are mid, 4 fixes |
| 23 | Tue 4 Aug | 11:00 | Carousel | AI and WhatsApp for your business |
| 24 | Wed 5 Aug | 19:00 | Carousel | Prompting vs fine tuning vs agents |
| 25 | Thu 6 Aug | 11:00 | Carousel | Build a CV that gets interviews with Claude |
| 26 | Fri 7 Aug | 11:00 | Carousel | The AI tools I actually use as a designer |
| 27 | Sat 8 Aug | 10:00 | Quote | The better the brief, the better the machine |
| 28 | Sun 9 Aug | 19:00 | Carousel | Agents, when AI stops chatting and starts doing |
| 29 | Mon 10 Aug | 11:00 | Carousel | 5 realistic ways to earn with AI skills in 2026 |
| 30 | Tue 11 Aug | 11:00 | Carousel | 30 days of AI, the mega recap (pin this) |

## How the automation works

- `content/calendar.json` holds every post: copy, caption, hashtags, time.
- `node scripts/render-post.js <date>` renders that day's finished slides plus a caption file into `content/output/<date>/`.
- A daily routine wakes Claude early each morning, which writes any outlined post into full copy in the brand voice, renders the slides, and sends them to Buhle's phone with the caption, ready to post at the scheduled time.
- Posting itself: upload via Instagram, or schedule free in Meta Business Suite. Instagram does not allow true auto posting without a business API setup; if we want that later, we connect the Instagram Graph API to a business account.

## Growth rules that matter more than any calendar

1. Reply to every comment in the first hour. The algorithm watches this window.
2. Share every post to stories with a poll or question sticker.
3. The handle, bio and link must match the brand kit before day one.
4. Track saves per post weekly; double down on the pillar that saves best.
5. Never miss the daily slot; consistency is the whole game.
