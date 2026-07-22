export type LetterType = {
  id: string
  label: string
  emoji: string
  color: string
  bgColor: string
}

export type Template = {
  id: string
  type: string
  name: string
  preview: string
  content: string
}

export const LETTER_TYPES: LetterType[] = [
  { id: 'love', label: 'Love Letter', emoji: '💕', color: 'text-rose-700', bgColor: 'bg-rose-50 border-rose-200' },
  { id: 'birthday', label: 'Birthday Wish', emoji: '🎂', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  { id: 'anniversary', label: 'Anniversary', emoji: '💍', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200' },
  { id: 'thank_you', label: 'Thank You', emoji: '🙏', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200' },
  { id: 'apology', label: 'Apology', emoji: '💙', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
  { id: 'friendship', label: 'Friendship', emoji: '🤝', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  { id: 'condolence', label: 'Condolence', emoji: '🕊️', color: 'text-slate-700', bgColor: 'bg-slate-50 border-slate-200' },
  { id: 'get_well', label: 'Get Well Soon', emoji: '🌸', color: 'text-pink-700', bgColor: 'bg-pink-50 border-pink-200' },
  { id: 'congratulations', label: 'Congratulations', emoji: '🎉', color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200' },
  { id: 'farewell', label: 'Farewell', emoji: '👋', color: 'text-teal-700', bgColor: 'bg-teal-50 border-teal-200' },
  { id: 'future_self', label: 'Future Self', emoji: '🕰️', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
]

export const TEMPLATES: Template[] = [
  // LOVE (3)
  {
    id: 'love-1',
    type: 'love',
    name: 'Classic Romance',
    preview: 'From the moment I met you, my world changed completely...',
    content: '<p>My Dearest,</p><p>From the moment I met you, my world changed completely. You brought color to the gray corners of my life, and warmth to the coldest days. Every morning I wake up grateful that you are mine, and every evening I count the hours until I can see your smile again.</p><p>You are not just the person I love — you are the person who taught me what love truly means. Patient, kind, endlessly wonderful. I am yours, completely and forever.</p><p>With all my heart,</p>',
  },
  {
    id: 'love-2',
    type: 'love',
    name: 'Poetic Declaration',
    preview: 'If I could paint the feeling of loving you...',
    content: '<p>To the one who holds my heart,</p><p>If I could paint the feeling of loving you, I would use every color in existence and still fall short. You are sunrise and starlight, laughter and stillness, home and adventure all at once.</p><p>I find myself thinking of you in quiet moments — the way your eyes crinkle when you laugh, the warmth of your hand in mine, the sound of your voice saying my name. These are the things I treasure most in this world.</p><p>You are my greatest joy and my softest place to land.</p><p>Forever yours,</p>',
  },
  {
    id: 'love-3',
    type: 'love',
    name: 'Simple & Sweet',
    preview: 'I never knew ordinary moments could feel so extraordinary...',
    content: '<p>My love,</p><p>I never knew ordinary moments could feel so extraordinary until I started spending them with you. Coffee in the morning. Walks in the evening. The way we talk about everything and nothing at all.</p><p>I do not need grand gestures or perfect words. I just need you — exactly as you are — beside me for all the days to come.</p><p>Thank you for being you. Thank you for being mine.</p><p>All my love,</p>',
  },

  // BIRTHDAY (3)
  {
    id: 'birthday-1',
    type: 'birthday',
    name: 'Warm & Joyful',
    preview: 'Today the world is a little brighter because you are in it...',
    content: '<p>Happy Birthday, dear one!</p><p>Today the world is a little brighter because you are in it. Another year of your laughter, your kindness, your wonderful self — and we are all the luckier for it.</p><p>May this birthday bring you everything you deserve: joy that overflows, peace that settles in your bones, and love from every direction. You give so much of yourself to everyone around you — today is your day to receive it all back tenfold.</p><p>Here\'s to you, to this year, and to all the beautiful things still ahead.</p><p>With so much love,</p>',
  },
  {
    id: 'birthday-2',
    type: 'birthday',
    name: 'Heartfelt Tribute',
    preview: 'There are not enough candles on any cake to represent how much you mean to me...',
    content: '<p>Dearest [Name],</p><p>There are not enough candles on any cake to represent how much you mean to me. On this special day, I want you to know exactly what you have meant in my life.</p><p>You have been my cheerleader when I doubted myself, my rock when life felt unsteady, and my reason to smile on the hardest days. Celebrating you is one of my favorite things to do.</p><p>May this year be filled with the kind of moments that make your heart sing. You deserve every wonderful thing the world has to offer.</p><p>Happiest of birthdays,</p>',
  },
  {
    id: 'birthday-3',
    type: 'birthday',
    name: 'Fun & Playful',
    preview: 'Another year wiser, more fabulous, and even harder to keep up with...',
    content: '<p>Happy Birthday!</p><p>Another year wiser, more fabulous, and even harder to keep up with. How do you do it?</p><p>I hope today is full of everything you love — good food, great company, and zero responsibilities. You have earned it. May your day be as extraordinary as you are, and may your year ahead be filled with adventures, surprises, and all the good things life has to offer.</p><p>Now go celebrate — you only turn this age once!</p><p>Cheers to you,</p>',
  },

  // ANNIVERSARY (3)
  {
    id: 'anniversary-1',
    type: 'anniversary',
    name: 'Timeless Love',
    preview: 'Another year with you, and I fall in love all over again...',
    content: '<p>My darling,</p><p>Another year with you, and I fall in love all over again — with your laugh, your heart, the way you see the world. Time has a funny way of making beautiful things even more precious, and that is exactly what has happened with us.</p><p>I look back on every moment we have shared with so much gratitude. And I look ahead with even more excitement, knowing you will be by my side for all of it.</p><p>Happy anniversary, my love. Thank you for choosing me, again and again.</p><p>Always yours,</p>',
  },
  {
    id: 'anniversary-2',
    type: 'anniversary',
    name: 'Milestone Reflection',
    preview: 'When I think about where we started and where we are now...',
    content: '<p>To my love,</p><p>When I think about where we started and where we are now, I am overwhelmed with gratitude. We have grown together, changed together, and loved each other through all of it.</p><p>Every season with you has taught me something new about love — its depth, its resilience, its quiet everyday beauty. You are the best decision I have ever made.</p><p>Here is to us, to everything we have built, and to all the years still ahead. I would choose you a thousand times over.</p><p>With endless love,</p>',
  },
  {
    id: 'anniversary-3',
    type: 'anniversary',
    name: 'Romantic Vow Renewal',
    preview: 'If I could go back to the day we met, I would do it all again...',
    content: '<p>My everything,</p><p>If I could go back to the day we met, I would do it all again — every argument, every tear, every moment of joy — because all of it led us here. And here is exactly where I want to be.</p><p>You are my home. Not a place, but a feeling — that deep, settled peace that comes from being with the person who truly knows you and loves you anyway.</p><p>Happy anniversary. I love you more today than I did yesterday, and I will love you more tomorrow than I do today.</p><p>Yours forever,</p>',
  },

  // THANK YOU (3)
  {
    id: 'thank_you-1',
    type: 'thank_you',
    name: 'From the Heart',
    preview: 'Some things in life are so big that "thank you" barely scratches the surface...',
    content: '<p>Dear [Name],</p><p>Some things in life are so big that "thank you" barely scratches the surface of what you feel. This is one of those times.</p><p>What you did for me — your generosity, your time, your care — has made a real difference. I will not forget it. And I hope that one day I can pass on even a fraction of that kindness to someone else who needs it.</p><p>You are one of the good ones. Truly.</p><p>With deepest gratitude,</p>',
  },
  {
    id: 'thank_you-2',
    type: 'thank_you',
    name: 'For a Friend',
    preview: 'I have been thinking about how to put into words what your friendship means to me...',
    content: '<p>Dear friend,</p><p>I have been thinking about how to put into words what your friendship means to me, and I keep coming back to this: you show up. In the big moments and the small ones. Without being asked and without keeping score.</p><p>Thank you for that. For being the kind of person I can call at any hour, for the laughter, for the honesty, for always having my back. I am so lucky to have you in my corner.</p><p>Grateful beyond words,</p>',
  },
  {
    id: 'thank_you-3',
    type: 'thank_you',
    name: 'For Support',
    preview: 'During one of the hardest chapters of my life, you were there...',
    content: '<p>Dear [Name],</p><p>During one of the hardest chapters of my life, you were there. You did not try to fix everything or say the perfect thing — you just stayed. And that meant everything.</p><p>Your support carried me through days when I did not know how I would get through them. I am on the other side now, and I owe a great deal of that to you.</p><p>Thank you for your patience, your presence, and your heart. I am forever grateful.</p><p>With love and gratitude,</p>',
  },

  // APOLOGY (3)
  {
    id: 'apology-1',
    type: 'apology',
    name: 'Sincere Sorry',
    preview: 'I have been holding these words for a while now, and it is time I said them...',
    content: '<p>Dear [Name],</p><p>I have been holding these words for a while now, and it is time I said them properly: I am sorry. Truly and completely sorry.</p><p>What I did — or said — was wrong. I was not thinking about how my actions would affect you, and that was selfish of me. You deserved better than that, and you deserve better than excuses now.</p><p>I value you and what we have too much to let this go unsaid. I hope you can forgive me, not because I deserve it, but because I am committed to doing better.</p><p>With sincerity,</p>',
  },
  {
    id: 'apology-2',
    type: 'apology',
    name: 'Heartfelt Reconciliation',
    preview: 'Losing your trust is something I never want to experience again...',
    content: '<p>Dear [Name],</p><p>Losing your trust is something I never want to experience again. And knowing that I am the one who caused this distance between us makes it even harder to bear.</p><p>I have had time to reflect on what happened, and I see clearly now what I could not see before. I was wrong. I hurt you, and that is not okay.</p><p>Please know that your feelings matter deeply to me. I am not asking you to pretend it did not happen — I am asking for the chance to prove that I have learned from it. If you are willing, I would very much like to start rebuilding what we had.</p><p>I am truly sorry,</p>',
  },
  {
    id: 'apology-3',
    type: 'apology',
    name: 'Simple & Direct',
    preview: 'No excuses, no explanations — just an honest and overdue apology...',
    content: '<p>Dear [Name],</p><p>No excuses, no explanations — just an honest and overdue apology.</p><p>I was wrong. I handled things badly and I hurt you in the process. That was never my intention, but intentions do not erase impact, and I understand that.</p><p>I am sorry. I hope, in time, you will be able to forgive me. And regardless of what happens between us, I want you to know that I care about you and I respect you enough to own my mistakes.</p><p>With genuine remorse,</p>',
  },

  // FRIENDSHIP (3)
  {
    id: 'friendship-1',
    type: 'friendship',
    name: 'Celebration of a Friend',
    preview: 'Not everyone is lucky enough to have a friend like you...',
    content: '<p>Dear [Name],</p><p>Not everyone is lucky enough to have a friend like you. I am starting to think I won some kind of cosmic lottery the day we met.</p><p>You are the kind of person who makes every room better just by being in it. The kind of friend who remembers the small things, shows up without being asked, and makes the hard days feel a little more bearable just by being around.</p><p>I do not say it enough, so I am saying it now: you are one of the most important people in my life, and I am so grateful for you.</p><p>Your lucky friend,</p>',
  },
  {
    id: 'friendship-2',
    type: 'friendship',
    name: 'Long Distance Friend',
    preview: 'The miles between us have never felt as heavy as they do sometimes...',
    content: '<p>Dear [Name],</p><p>The miles between us have never felt as heavy as they do sometimes. But then I think of everything we have shared — the laughs, the late nights, the conversations that went on far too long — and I realize that distance has never really been able to touch what we have.</p><p>You are one of those rare people who fits perfectly into your life no matter how much time has passed or how far apart you are. I miss you, and I am so glad you exist.</p><p>Sending love across the distance,</p>',
  },
  {
    id: 'friendship-3',
    type: 'friendship',
    name: 'Through It All',
    preview: 'We have seen each other through a lot, you and I...',
    content: '<p>Dear [Name],</p><p>We have seen each other through a lot, you and I. Good years, hard years, the ones we do not talk about and the ones we will never stop laughing about. Through all of it, you have been a constant.</p><p>I think there is something really rare about a friendship that can hold all of that — the joy and the mess and everything in between — and still come out stronger on the other side. That is what we have.</p><p>Thank you for sticking around. Thank you for being you. I cannot imagine this life without you in it.</p><p>Always your friend,</p>',
  },

  // CONDOLENCE (3)
  {
    id: 'condolence-1',
    type: 'condolence',
    name: 'Gentle Comfort',
    preview: 'There are no words that can take away the pain of losing someone you love...',
    content: '<p>Dear [Name],</p><p>There are no words that can take away the pain of losing someone you love. I know that, and I am not going to pretend otherwise. What I can say is this: I am so deeply sorry for your loss.</p><p>[Name] was a remarkable person, and the mark they left on this world — and on you — will never fade. Grief is just love with nowhere to go, and right now you have so much love.</p><p>Please know that I am here. Not to fix anything, but just to be present however you need. You do not have to go through this alone.</p><p>With love and sorrow,</p>',
  },
  {
    id: 'condolence-2',
    type: 'condolence',
    name: 'In Remembrance',
    preview: 'I keep thinking about the kindness that defined them...',
    content: '<p>Dear [Name],</p><p>I keep thinking about the kindness that defined [Name] — the way they made everyone around them feel seen, the warmth they carried into every room. Losing someone like that leaves a very real absence in the world.</p><p>I want you to know that you are not alone in your grief. Many of us are holding space for this loss, and for you. Lean on us. Let yourself be held right now.</p><p>If there is anything I can do — anything at all — please do not hesitate to reach out. I mean that sincerely.</p><p>With heartfelt condolences,</p>',
  },
  {
    id: 'condolence-3',
    type: 'condolence',
    name: 'For a Difficult Time',
    preview: 'I wish I had better words. I wish I could do more...',
    content: '<p>Dear [Name],</p><p>I wish I had better words. I wish I could do more. Knowing that you are hurting and not being able to take that pain away is one of the most helpless feelings there is.</p><p>What I do know is that grief, as heavy as it is, is also a testament to love. The depth of your pain is a measure of how deeply you cared, and that love is something no loss can ever take away.</p><p>Be gentle with yourself in the days ahead. You are allowed to grieve however you need to. I am here.</p><p>Thinking of you always,</p>',
  },

  // GET WELL (3)
  {
    id: 'get_well-1',
    type: 'get_well',
    name: 'Warm Wishes',
    preview: 'Being under the weather is never fun, but I hope knowing people care helps a little...',
    content: '<p>Dear [Name],</p><p>Being under the weather is never fun, but I hope knowing that people care helps even a little. I have been thinking about you and sending all the good energy I can your way.</p><p>Please rest, eat well, and let yourself be taken care of for once. You spend so much time looking after everyone else — now it is your turn to receive that care.</p><p>Get well soon. The world is a little less bright without you at full strength, and we all need you back.</p><p>With warm wishes,</p>',
  },
  {
    id: 'get_well-2',
    type: 'get_well',
    name: 'Cheering You On',
    preview: 'You are one of the strongest people I know, and I have no doubt you will get through this...',
    content: '<p>Dear [Name],</p><p>You are one of the strongest people I know, and I have no doubt you will get through this. But strength does not mean you have to go through it alone.</p><p>I am here — for whatever you need. Whether that is company, a meal, a distraction, or just someone to sit with. Say the word.</p><p>Focus on healing. Let your body do what it knows how to do. And know that you have people rooting for you, every single day.</p><p>Get well soon — we miss you,</p>',
  },
  {
    id: 'get_well-3',
    type: 'get_well',
    name: 'Light & Hopeful',
    preview: 'I am counting down the days until you are back to your wonderful self...',
    content: '<p>Dear [Name],</p><p>I am counting down the days until you are back to your wonderful self. In the meantime, I hope you are finding moments of peace and comfort in the healing process.</p><p>Think of this as a forced rest — your body asking you to slow down and take care of yourself. Honor that. Rest deeply, laugh when you can, and let the good things find their way to you.</p><p>Wishing you strength, healing, and a very speedy recovery.</p><p>With lots of love,</p>',
  },

  // CONGRATULATIONS (3)
  {
    id: 'congratulations-1',
    type: 'congratulations',
    name: 'Proud & Joyful',
    preview: 'I cannot stop smiling thinking about what you have accomplished...',
    content: '<p>Dear [Name],</p><p>I cannot stop smiling thinking about what you have accomplished. You worked so hard for this, and watching you get there has been one of my favorite things to witness.</p><p>This achievement is a reflection of who you are — determined, talented, and absolutely unstoppable when you set your mind to something. I am so proud of you, and I hope you let yourself feel that pride too.</p><p>Congratulations from the bottom of my heart. Now go celebrate — you have more than earned it.</p><p>With so much pride and joy,</p>',
  },
  {
    id: 'congratulations-2',
    type: 'congratulations',
    name: 'New Chapter',
    preview: 'What an incredible moment to be stepping into...',
    content: '<p>Dear [Name],</p><p>What an incredible moment to be stepping into. A new chapter is beginning for you, and I could not be more excited to watch it unfold.</p><p>You bring so much to everything you do. Your dedication, your creativity, your heart — they are going to take you so far. And the best part is, you are just getting started.</p><p>Congratulations on this wonderful milestone. Here is to everything that comes next — may it be everything you have dreamed of and more.</p><p>Cheering you on always,</p>',
  },
  {
    id: 'congratulations-3',
    type: 'congratulations',
    name: 'You Did It',
    preview: 'Remember when this felt impossible? Look at you now...',
    content: '<p>Dear [Name],</p><p>Remember when this felt impossible? Look at you now.</p><p>You did not just reach your goal — you showed up every single day, even when it was hard, even when you wanted to quit. That kind of persistence is rare and it is something to be genuinely proud of.</p><p>Congratulations on this achievement. I always knew you had it in you, and now the whole world gets to see it too. This is just the beginning.</p><p>So proud of you,</p>',
  },

  // FAREWELL (3)
  {
    id: 'farewell-1',
    type: 'farewell',
    name: 'Bittersweet Goodbye',
    preview: 'Goodbyes are never easy, especially when they involve someone as wonderful as you...',
    content: '<p>Dear [Name],</p><p>Goodbyes are never easy, especially when they involve someone as wonderful as you. You have been such an important part of this chapter of my life, and I find myself struggling to imagine it without you nearby.</p><p>But I also know that wherever you are going, you are going to do incredible things. You carry your gifts with you everywhere, and any place you land is lucky to have you.</p><p>Thank you for everything you have given to this place, to me, and to everyone whose life you have touched. Go and be brilliant. And do not be a stranger.</p><p>Until we meet again,</p>',
  },
  {
    id: 'farewell-2',
    type: 'farewell',
    name: 'New Adventure',
    preview: 'You are not leaving — you are leveling up...',
    content: '<p>Dear [Name],</p><p>You are not leaving — you are leveling up. And while part of me wishes this next chapter was happening a little closer to home, the bigger part of me is nothing but excited for you.</p><p>Adventure suits you. New places, new challenges, new people who are about to be very lucky to know you. Go into it with everything you have — your curiosity, your warmth, your unstoppable energy.</p><p>We will miss you more than words can say. But we will also be watching you soar, and cheering every step of the way.</p><p>Go get it,</p>',
  },
  {
    id: 'farewell-3',
    type: 'farewell',
    name: 'Until We Meet Again',
    preview: 'Distance is just a number when the connection is real...',
    content: '<p>Dear [Name],</p><p>Distance is just a number when the connection is real. And what we have built — this friendship, this bond — is real enough to survive any miles between us.</p><p>You are taking a piece of my heart with you as you go. And that is okay, because you have always known how to take care of the things that matter.</p><p>Go and live beautifully. Come back and tell me everything. And know that no matter how much time passes, you will always have a home here — in this place and in my heart.</p><p>Until we meet again,</p>',
  },

  // FUTURE SELF (3)
  {
    id: 'future_self-1',
    type: 'future_self',
    name: 'One Year From Now',
    preview: 'By the time you read this, a whole year will have happened to you...',
    content: '<p>Dear me,</p><p>By the time you read this, a whole year will have happened to you. I hope some of it was good. I hope you laughed at something so hard you could not breathe. I hope you were brave at least once when it would have been easier not to be.</p><p>Here is where I am today: I am worried about things I cannot control, I am proud of a few things I rarely say out loud, and I am trying. Whatever happened between then and now, please remember that this version of you was trying.</p><p>If things went well — celebrate properly, not just in your head. If they did not — you are still here, reading this, and that counts for more than you think.</p><p>Rooting for you,</p>',
  },
  {
    id: 'future_self-2',
    type: 'future_self',
    name: 'Promises I\'m Making',
    preview: 'These are the promises I am making today, and I want you to hold me to them...',
    content: '<p>To the person I am becoming,</p><p>These are the promises I am making today, and I want you to hold me to them.</p><p>I promise to stop waiting for the perfect moment to start. I promise to be kinder to my body and less patient with people who make me feel small. I promise to say the thing instead of rehearsing it for weeks.</p><p>If you are reading this and I kept even one of them — good. If I kept none of them, do not be cruel about it. Just start again today. That has always been allowed.</p><p>Tell me honestly: are you happier? Are you the person we talked about being? There is still time.</p><p>With hope,</p>',
  },
  {
    id: 'future_self-3',
    type: 'future_self',
    name: 'A Snapshot of Right Now',
    preview: 'I want you to remember exactly what this moment felt like...',
    content: '<p>Hello, future me,</p><p>I want you to remember exactly what this moment felt like, because memory softens everything and I do not want this one blurred.</p><p>Right now, my days look like this — the same walk, the same songs on repeat, the same people I would drop everything for. The thing I am most afraid of is still the same thing. The thing I most want, I have not said out loud to anyone.</p><p>Whatever your life looks like now, I hope you still notice small things: good coffee, warm light, someone remembering a detail about you. That was always the good part.</p><p>Do not forget who you were when you wrote this.</p><p>With love, from then,</p>',
  },
]

export function getTemplatesForType(type: string): Template[] {
  return TEMPLATES.filter((t) => t.type === type)
}
