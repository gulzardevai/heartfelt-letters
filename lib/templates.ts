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
  // Optional extras used by the on-page template library (see LOVE_LIBRARY).
  // `body` is the same letter as plain-text paragraphs so an occasion page can
  // render it in full and offer a one-click copy without parsing HTML.
  when?: string
  body?: string[]
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
  { id: 'christmas', label: 'Christmas', emoji: '🎄', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
  { id: 'future_self', label: 'Future Self', emoji: '🕰️', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200' },
]

// The love letter template library rendered in full on /letters/love.
// Every letter here is complete and fill-in-the-blank: the sentences are
// written, the personal parts are bracketed prompts. Kept as plain ASCII so a
// copy-paste into any app, phone or card stays clean.
type LibrarySeed = { id: string; name: string; when: string; preview: string; body: string[] }

const LOVE_LIBRARY_SEED: LibrarySeed[] = [
  {
    id: 'love-short',
    name: 'Short love letter template',
    when: 'You want to say something true tonight without writing an essay. Under a hundred words and it still lands.',
    preview: 'This one is short on purpose. I did not want to wait until I had something clever...',
    body: [
      'Dear [their name],',
      'This one is short on purpose. I did not want to wait until I had something clever to say, because that is how [how long] has already gone by without me saying it.',
      'I love [one specific thing they do]. Not the big obvious thing. That one.',
      'That is the whole letter. You were thought about today, on an ordinary [day of the week], by someone who is not going anywhere.',
      'Love, [your name]',
    ],
  },
  {
    id: 'love-long',
    name: 'Long love letter template',
    when: 'An anniversary, a birthday, or the night you finally write the letter you have been rehearsing for a year.',
    preview: 'I have been trying to write this for a while, which should probably tell you something...',
    body: [
      'Dear [their name],',
      'I have been trying to write this for [how long], which should probably tell you something about how badly I want to get it right.',
      'Here is where I want to start. [Where you were], on [when], and you were [what they were doing]. Nothing about that day was supposed to matter. It is the one I keep coming back to, because that was the moment I stopped wondering how I felt about you.',
      'There is a thing you do that I am fairly sure you do not know you do. [The small habit.] I have watched you do it for [how long] and never mentioned it, partly because I did not want you to stop.',
      'Before you, I believed [what you used to think about love, or about yourself]. You never argued me out of it. You just kept [what they did], quietly, until one day I noticed I did not believe it any more.',
      'The hardest stretch we have had so far was [the difficult time]. What I remember is not the difficulty. It is that you [what they did while it was happening]. I have never properly thanked you for that, so: thank you.',
      'What I promise you is [one promise you actually intend to keep]. Not a grand one. One I can hand you again next year and still mean.',
      'Love, [your name]',
    ],
  },
  {
    id: 'love-long-distance',
    name: 'Long-distance love letter template',
    when: 'Different cities, different time zones, and a countdown to the next time you are in the same room.',
    preview: 'It is late here, which means it is the middle of your afternoon, which means you are probably...',
    body: [
      'Dear [their name],',
      'It is [the time] here, which means it is [their time] there, which means you are probably [what they are doing right now]. I like knowing that. It is the closest thing I get to being in the room.',
      'The distance is hardest at [the specific moment: the end of the day, Sunday mornings, the second something good happens and you cannot turn and tell them]. Not the big occasions. That part surprised me.',
      'Here is what happened this week that I would have told you across a table: [the small story]. It is not important. That is exactly why I want you to have it.',
      'I keep [the object or habit that stands in for them] where I can see it, because [why].',
      '[Number] days until [the next time you see each other]. I have counted more than once, and I will count again after I send this.',
      'Until then: I am here, I am not tired of this, and I would rather have you at [the distance] than anyone else at arm\'s length.',
      'Love, [your name]',
    ],
  },
  {
    id: 'love-anniversary',
    name: 'Anniversary love letter template',
    when: 'One year or thirty. Write about this year specifically instead of summarising all of them.',
    preview: 'Years today. I am not going to write about all of them, only about this one...',
    body: [
      'Dear [their name],',
      '[Number] years today. I am not going to try to write about all of them. Only this one.',
      'The moment I keep coming back to from this year is not [the obvious highlight]. It is [the ordinary moment] - you were [what they were doing], and I remember thinking [what you thought].',
      'This year you did something I never properly thanked you for: [the thing]. I noticed it at the time and said nothing, which is a habit I would like to break, starting here.',
      'Then [the hard part of the year] happened, and you were [how they were] the whole way through it. That is the part of this year I will still be telling people about in ten years.',
      'The small thing I have quietly fallen in love with is [the habit]. You have no idea you do it.',
      'Next year I want us to [something concrete and small enough to actually happen].',
      'Happy anniversary. I would do all [number] again, including the parts we do not talk about.',
      'Love, [your name]',
    ],
  },
  {
    id: 'love-first',
    name: 'First "I love you" letter template',
    when: 'You want to say it properly, in one piece, without losing your nerve halfway through.',
    preview: 'I am writing this rather than saying it because I want to get it out in one piece...',
    body: [
      'Dear [their name],',
      'I am writing this rather than saying it out loud, because I want to get it out in one piece and I know myself well enough to know I would not.',
      'I love you.',
      'I have known since [when], which is longer than I have let on. It was not a dramatic moment. It was [what was happening] - you were [what they were doing] - and something in me went quiet and certain about it.',
      'I am not asking you for anything back today. This is not a test and there is no correct reply. If you need time, take it. I promise not to be strange about it.',
      'What I do want you to know is that this is not a word I use lightly, and I sat with it for [how long] before I wrote it down.',
      'I love you. I would like to keep saying it.',
      '[Your name]',
    ],
  },
  {
    id: 'love-sorry',
    name: 'Sorry love letter template',
    when: 'You were wrong, you know exactly how, and you want to apologise without it turning into an argument.',
    preview: 'I am sorry for what I did. Not for how it came across - for the thing itself...',
    body: [
      'Dear [their name],',
      'I am sorry for [exactly what you did]. Not for how it came across, not for the misunderstanding. For the thing itself.',
      'Here is what I understand now that I did not understand then: [what it actually cost you]. You told me at the time and I defended myself instead of listening, and that is a second thing to be sorry for.',
      'I am not going to explain why I did it. There is a reason, it is not a good enough one, and putting it in this letter would only turn an apology into an argument.',
      'What I am changing is [the specific, checkable thing]. Not "I will do better" - [the actual concrete change]. You are allowed to hold me to it, and you are allowed to be unconvinced for a while.',
      'I am not asking you to be over it by the time you finish reading this. I am asking you to believe that I know what I did.',
      'I am sorry. I love you.',
      '[Your name]',
    ],
  },
  {
    id: 'love-for-her',
    name: 'Love letter template for her',
    when: 'You want to name the thing she does that she is certain nobody notices.',
    preview: 'I want to tell you something I am fairly sure you think nobody has noticed...',
    body: [
      'Dear [her name],',
      'I want to tell you something I am fairly sure you think nobody has noticed.',
      '[The thing she does that goes unthanked: the way she checks on people, the thing she carries for everyone, how she is with her family.] I have watched you do it for [how long]. You never announce it and nobody thanks you for it, so I am thanking you for it here, in writing, where you can keep it.',
      'The version of you I love most is not the one everyone else gets. It is [the private version: first thing in the morning, halfway through a story, the second you forget to perform].',
      'You changed how I see [what]. I used to think [what you thought]. Now I think [what you think], and that is entirely your doing.',
      'I am not going anywhere. [One specific promise you mean.]',
      'Love, [your name]',
    ],
  },
  {
    id: 'love-for-him',
    name: 'Love letter template for him',
    when: 'He gets thanked for what he does and almost never told what you think of him.',
    preview: 'There is something men do not get told often enough, so I am putting it in writing...',
    body: [
      'Dear [his name],',
      'There is something men do not get told nearly often enough, so I am putting it in writing where you can read it twice.',
      'I am proud of you. Not for [the obvious achievement] - for [the unglamorous thing: the shift you took, the call you made, the way you kept going when stopping would have been easier]. I saw it. I have described it to other people when you were not in the room.',
      'You do not have to hold it together in here. Whatever it costs you to be the person who has it handled, I would rather you put it down with me than carry it neatly.',
      'The small thing I love, which you probably think is nothing: [the habit].',
      'You are [what he is to you], and I would pick you again on the ordinary days, not only the good ones.',
      'Love, [your name]',
    ],
  },
]

const LOVE_LIBRARY: Template[] = LOVE_LIBRARY_SEED.map(s => ({
  id: s.id,
  type: 'love',
  name: s.name,
  when: s.when,
  preview: s.preview,
  body: s.body,
  content: s.body.map(p => `<p>${p}</p>`).join(''),
}))

export const TEMPLATES: Template[] = [
  // LOVE — the fill-in-the-blank library shown in full on /letters/love
  ...LOVE_LIBRARY,

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
  {
    id: 'love-4',
    type: 'love',
    name: 'An Ordinary Wednesday',
    preview: 'Nothing happened today. That is exactly why I am writing...',
    content: '<p>Hey you,</p><p>Nothing happened today. No anniversary, no birthday, no reason at all — and that is exactly why I am writing. Somewhere between the walk home and putting the kettle on, you crossed my mind, and I decided that this time I would tell you instead of just smiling to myself.</p><p>I like my life with you in it. The ordinary parts most of all — the half-finished conversations, the way you narrate what you are cooking, the fact that a boring errand is somehow better when you come along.</p><p>That is the whole letter. You were thought of today, on a day when nothing was happening. It felt worth putting in writing.</p><p>Yours,</p>',
  },
  {
    id: 'love-5',
    type: 'love',
    name: 'After the Other Night',
    preview: 'I keep replaying one small moment from the other night...',
    content: '<p>Hi,</p><p>I keep replaying one small moment from the other night — not the obvious one, a smaller one. The pause before you answered my question, like you were actually deciding to tell me the truth. People rarely do that, and I noticed.</p><p>I had a genuinely good time. I am not going to dress that up in anything cooler than it is.</p><p>No pressure attached to this letter — it asks for nothing. But if you wanted to do it again, I already know where I would take you.</p><p>Until then,</p>',
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
  {
    id: 'thank_you-grandma',
    type: 'thank_you',
    name: 'To Grandma',
    preview: 'I was thinking about your kitchen today — and then I thought, does she know?...',
    content: '<p>Dear Grandma,</p><p>I was thinking about your kitchen today. The way it always smelled like something was almost ready, the chair by the window that was somehow mine, the fact that nothing I did there was ever a bother. And then I thought — does she know? Have I ever actually told her?</p><p>So I am telling you now. So much of what feels safe and good in my life, I first learned at your house. You made being loved feel ordinary, and it took me years to realise how rare that is.</p><p>I would trade a lot for one more afternoon at your table. Until then, this letter will have to hold some of it.</p><p>All my love,</p>',
  },
  {
    id: 'thank_you-grandpa',
    type: 'thank_you',
    name: 'To Grandpa',
    preview: 'You probably don’t remember teaching me half the things I use every week...',
    content: '<p>Dear Grandpa,</p><p>You probably don’t remember teaching me half the things I use every week. How to check something twice before calling it done. How to be quiet in a way that isn’t empty. You never announced any of it — you just did things, and I was watching.</p><p>I still tell people your stories. The ones I have heard twenty times are the ones I retell the most, and I want to hear them all again, so consider this a request.</p><p>I don’t say this kind of thing out loud, and neither do you, which is exactly why I am writing it down: I am proud to be yours.</p><p>With love,</p>',
  },
  {
    id: 'thank_you-grandchild',
    type: 'thank_you',
    name: 'From a Grandparent',
    preview: 'By the time you read this, you may be taller than me. Some things you should know...',
    content: '<p>My dear [Name],</p><p>By the time you read this, you may well be taller than me, and busier than I ever was. So let me put a few things down while I have your attention.</p><p>I remember the day you were born better than I remember most of last week. I remember your first steps in our hallway, and the questions you asked that none of us could answer. Watching you grow has been one of the great joys of my life — I want you to know that plainly, in writing, from me.</p><p>Wherever life takes you, our door and my heart are open. You come from people who love you. Carry that with you.</p><p>Forever yours,</p>',
  },
  {
    id: 'thank_you-mom',
    type: 'thank_you',
    name: 'To Mom',
    preview: 'I caught myself doing the thing you always do — and had to sit down and write this...',
    content: '<p>Dear Mom,</p><p>I caught myself doing the thing you always do — checking the stove twice, saying "text me when you\'re home" — and I had to sit down and write this, because it finally landed: so much of who I am is just you, carried forward.</p><p>There are things I did not understand until I had to do them myself. How tired you must have been. How often you chose us without announcing it. How many things you wanted that you quietly set down so we could have ours.</p><p>I understand more now, and I want it on paper: thank you. Not for one thing — for the whole long unglamorous everything of it.</p><p>I love you,</p>',
  },
  {
    id: 'thank_you-dad',
    type: 'thank_you',
    name: 'To Dad',
    preview: 'You never made speeches. You just showed up, every single time...',
    content: '<p>Dear Dad,</p><p>You never made speeches. You just showed up — every practice, every breakdown on the side of the road, every time I said I was fine and clearly wasn\'t. I used to think that was normal. I know better now.</p><p>Half the things I do well, I learned by standing next to you while you did them. You never once called it a lesson, which is probably why it stuck.</p><p>We are not big on saying this kind of thing out loud, so I am writing it instead: I noticed all of it. I am grateful for all of it. And when people say I remind them of you, I take it as a compliment every time.</p><p>Your kid,</p>',
  },
  {
    id: 'thank_you-gratitude',
    type: 'thank_you',
    name: 'A Gratitude Letter',
    preview: 'I have been keeping a list of things I am grateful for, and you keep appearing on it...',
    content: '<p>Dear [Name],</p><p>I have been keeping a mental list of the things I am grateful for this year, and your name keeps appearing on it in places you would not expect. Not the obvious moments — the small ones. The message you sent at exactly the right hour. The thing you remembered that I only mentioned once.</p><p>Gratitude is a strange thing to sit on. It builds up quietly and then it feels awkward to say out loud, so most of it never gets said at all. I decided to stop doing that, starting with you.</p><p>So: thank you. For [the specific thing], and for the general fact of you being in my life while all of this was going on.</p><p>With real gratitude,</p>',
  },
  {
    id: 'thank_you-thanksgiving',
    type: 'thank_you',
    name: 'Thanksgiving to Family',
    preview: 'Around the table we say what we are thankful for in one sentence. Here is the long version...',
    content: '<p>Dear [Name],</p><p>Around the table we each get one sentence to say what we are thankful for, and I never manage to say the true thing in time. So here is the long version, written down where I cannot be interrupted by the potatoes.</p><p>I am thankful that you are the person who [what they do]. I am thankful for the year we just had, including the parts of it I would not choose again, because you were there for those too.</p><p>I know families are complicated and ours is no exception. That is exactly why I want this on paper: whatever else is true, I am glad you are mine.</p><p>Happy Thanksgiving. Save me a seat.</p><p>With love,</p>',
  },
  {
    id: 'thank_you-gratitude-late',
    type: 'thank_you',
    name: 'The Thank You I Owe You',
    preview: 'This is years late, and I decided late was better than never...',
    content: '<p>Dear [Name],</p><p>This is years late. I thought about that for a while and decided late was still much better than never.</p><p>You probably do not remember [the thing you did]. You were not making a grand gesture — you were just being who you are on an ordinary day. But it landed, and it stayed, and it has quietly shaped how I have handled things ever since.</p><p>I have wondered a few times whether you know. I assume you do not, because people rarely do. So consider this the correction: it mattered, it is still mattering, and I have carried it further than you would guess.</p><p>Thank you, belatedly and completely,</p>',
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
  {
    id: 'friendship-sister',
    type: 'friendship',
    name: 'To My Sister',
    preview: 'Nobody else remembers our childhood from the inside except you...',
    content: '<p>Dear [Name],</p><p>There is exactly one other person alive who remembers our childhood from the inside, and it is you. That is a strange kind of intimacy — you were there for the version of me nobody else met, and you have never once let me rewrite it.</p><p>I do not think I have ever properly said what watching you become who you are has been like. You handled [the hard thing] in a way I am not sure I could have. I have told other people about it more than once.</p><p>We do the sibling thing where affection arrives disguised as insults, and I like that we do. This letter is me dropping the disguise for one page: I am lucky you are my sister, and I would pick you even if we had not been assigned to each other.</p><p>Love,</p>',
  },
  {
    id: 'friendship-brother',
    type: 'friendship',
    name: 'To My Brother',
    preview: 'We are not the kind of brothers who say this out loud, so I am writing it down...',
    content: '<p>Dear [Name],</p><p>We are not really the kind of siblings who say this sort of thing out loud, which is precisely why I am writing it down instead. You can read it once and never mention it again — that is allowed.</p><p>I have been thinking about [the memory]. You were [what he was doing], and I have never told you that it changed how I saw the whole thing.</p><p>You are better at [the thing] than you give yourself credit for, and worse at [the other thing] than you think, and I say both with total affection. Whatever happens, you have got a brother in your corner permanently. No conditions on it.</p><p>Talk soon,</p>',
  },
  {
    id: 'friendship-sibling-distance',
    type: 'friendship',
    name: 'The Sibling You Drifted From',
    preview: 'We did not fall out. We just stopped being in the same room...',
    content: '<p>Dear [Name],</p><p>We did not fall out. Nothing dramatic happened. We just stopped being in the same rooms, and then we stopped knowing the small things, and now I find out about your life in updates from other people.</p><p>I am not writing this to assign blame — most of the distance is just adulthood, and some of it is mine. I am writing because I noticed it, and noticing something and doing nothing has never worked out for me.</p><p>Here is the truthful part: I miss you. Not the idea of a sibling — you specifically, the one who [the specific thing]. If you wanted to fix a date and actually keep it, I would be there.</p><p>Whenever you are ready,</p>',
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

  // CHRISTMAS (3)
  {
    id: 'christmas-1',
    type: 'christmas',
    name: 'Christmas Letter to Family',
    preview: 'Before the day itself swallows everything, I wanted to write you something...',
    content: '<p>Dear [Name],</p><p>Before the day itself swallows everything — the cooking, the visitors, the two hours of unwrapping — I wanted to write you something that is not shouted across a kitchen.</p><p>This year with you had [the good part] in it, and [the harder part] too. I would not want to have done either one without you. That is the whole of what I mean when I say Merry Christmas, and it is more than a card has room for.</p><p>What I want for next year is simple and I will say it plainly: more of the ordinary time with you. Not the big occasions. The Tuesdays.</p><p>Merry Christmas. I love you.</p>',
  },
  {
    id: 'christmas-2',
    type: 'christmas',
    name: 'What to Write in a Christmas Card',
    preview: 'A short, warm Christmas message that still sounds like a real person...',
    content: '<p>Dear [Name],</p><p>Merry Christmas from all of us here.</p><p>The thing I keep thinking about from this year is [one specific moment with them]. It was small and I have brought it up three times since, which is how I know it mattered.</p><p>I hope your Christmas is a slow one — good food, nowhere urgent to be, and the people you actually like in the room. If the year ahead brings you [what you wish for them], I will be very pleased about it.</p><p>Thinking of you at Christmas and meaning it,</p>',
  },
  {
    id: 'christmas-santa',
    type: 'christmas',
    name: 'Letter to Santa',
    preview: 'Dear Santa, my name is... — a letter a child can fill in and send...',
    content: '<p>Dear Santa,</p><p>My name is [your name] and I am [your age] years old. I live in [where you live], and this year I have been [mostly good / trying very hard].</p><p>Here is the good thing I did that nobody made me do: [what you did].</p><p>If you have room on the sleigh, what I would really like is [what you would like]. If that is too big, [something smaller] would be brilliant too.</p><p>I will leave out [what you will leave for Santa] for you and something for the reindeer as well. Please tell them thank you from me — I know it is a long way.</p><p>Merry Christmas, Santa.</p><p>Love, [your name]</p>',
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

// Full templates (with `body`) for the on-page library, in the order requested.
export function getTemplateLibrary(ids: string[]): Template[] {
  return ids
    .map(id => TEMPLATES.find(t => t.id === id))
    .filter((t): t is Template => Boolean(t?.body))
}
