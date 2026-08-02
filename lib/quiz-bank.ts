// Predefined question bank for the "How well do you know me?" quiz builder.
// Creators no longer write questions — they pick their true answer to 10 random
// questions from this bank. Every question has exactly 4 universally answerable,
// mutually exclusive choices. Kept free of React so server code can import it.

export type BankQuestion = {
  id: string
  emoji: string
  question: string
  choices: [string, string, string, string]
}

export const QUIZ_BANK: BankQuestion[] = [
  // ===== Food & drink =====
  { id: 'drink-order', emoji: '☕', question: "What's my go-to drink order?", choices: ['Coffee, always coffee', 'Tea person through and through', 'Something fizzy', 'Just water, honestly'] },
  { id: 'pizza-style', emoji: '🍕', question: 'How do I behave around pizza?', choices: ['Fold it and inhale it', 'Knife and fork, like a civilized person', 'Eat the toppings first', 'Save the crust for last — best part'] },
  { id: 'breakfast', emoji: '🍳', question: "What's my actual breakfast most days?", choices: ['A real cooked breakfast', 'Cereal or toast, something quick', 'Just coffee counts, right?', 'I skip it entirely'] },
  { id: 'spice', emoji: '🌶️', question: 'How do I handle spicy food?', choices: ['Bring on the fire', 'Medium spice, keep it sensible', 'Mild — and even that is risky', 'I avoid spice at all costs'] },
  { id: 'dessert', emoji: '🍰', question: 'Dessert menu arrives. What do I do?', choices: ['Order the chocolate thing, obviously', 'Suggest we share one', 'Say no… then eat half of yours', 'Actually skip dessert'] },
  { id: 'snack', emoji: '🍿', question: "What's my snack personality?", choices: ['Salty — chips and crackers', 'Sweet — chocolate and candy', 'Both, in the same sitting', 'Weirdly healthy — fruit and nuts'] },
  { id: 'cooking', emoji: '👩‍🍳', question: 'What am I like in the kitchen?', choices: ['Actually a great cook', 'I have exactly three good dishes', 'Chaos, smoke alarm included', 'I mostly supervise the takeout order'] },
  { id: 'restaurant-order', emoji: '📋', question: 'How do I order at a restaurant?', choices: ['Same dish every single time', 'Whatever looks new and exciting', 'Ask everyone what they are getting first', 'Panic and order last-minute'] },
  { id: 'leftovers', emoji: '🥡', question: 'What happens to my leftovers?', choices: ['Eaten cold straight from the fridge', 'Properly reheated like a meal', 'Forgotten until they become science', 'There are never leftovers'] },
  { id: 'ice-cream', emoji: '🍦', question: 'My ice cream order is…', choices: ['Classic chocolate or vanilla', 'Something fruity', 'The weirdest flavor on the board', 'Whatever has the most stuff in it'] },

  // ===== Habits & daily life =====
  { id: 'sleep-time', emoji: '😴', question: 'What time do I actually fall asleep?', choices: ['Before 10pm, like a responsible adult', 'Around midnight', 'Way past midnight, every night', 'It changes wildly every day'] },
  { id: 'morning-mood', emoji: '🌅', question: 'What am I like in the morning?', choices: ['Annoyingly cheerful', 'Functional after coffee', 'Do not speak to me for an hour', 'What is a morning'] },
  { id: 'alarm', emoji: '⏰', question: 'How do I deal with my alarm?', choices: ['Up on the first ring', 'One snooze, then up', 'Snooze at least three times', 'I set five alarms and ignore them all'] },
  { id: 'phone-notifs', emoji: '📱', question: 'How many unread notifications do I have?', choices: ['Zero — inbox zero life', 'A manageable handful', 'Somewhere in the hundreds', 'A number with a comma in it'] },
  { id: 'running-late', emoji: '🏃', question: 'Am I usually on time?', choices: ['Early, always early', 'Exactly on time', 'Five to ten minutes late', '"On my way" means I just woke up'] },
  { id: 'weekend', emoji: '🛋️', question: "What's my ideal weekend?", choices: ['Out with people, plans stacked', 'One nice outing, then home', 'Couch, snacks, zero pants plans', 'Errands and life admin, weirdly'] },
  { id: 'phone-battery', emoji: '🔋', question: "What's my phone battery usually at?", choices: ['Charged and ready, 80%+', 'Comfortably mid, 40–60%', 'Living dangerously under 20%', 'Perpetually on 1% and thriving'] },
  { id: 'texting-style', emoji: '💬', question: 'How do I text?', choices: ['Instant replies, always', 'Reply within the hour', 'Read it, think "later", forget forever', 'Voice notes, endless voice notes'] },
  { id: 'tabs', emoji: '🖥️', question: 'How many browser tabs do I have open?', choices: ['One or two, clean and tidy', 'Under ten, mostly organized', 'Dozens — they spark joy', 'The number is a cry for help'] },
  { id: 'shower-time', emoji: '🚿', question: 'What are my showers like?', choices: ['Quick and efficient, in and out', 'A full concert performance', 'Where I solve all my problems', 'So long the hot water gives up'] },

  // ===== Personality =====
  { id: 'annoyed-by', emoji: '😤', question: "What's most likely to annoy me?", choices: ['Slow walkers', 'Loud chewing', 'Being interrupted', 'People who are late'] },
  { id: 'party-role', emoji: '🎉', question: "What's my role at a party?", choices: ['Center of the dance floor', 'Deep conversation in the kitchen', 'Best friends with the pet', 'Plotting my exit by 10pm'] },
  { id: 'decisions', emoji: '🤔', question: 'How do I make decisions?', choices: ['Instantly, gut feeling', 'Pros and cons list, maybe a spreadsheet', 'Ask everyone I know first', 'Agonize, then choose randomly anyway'] },
  { id: 'stress-response', emoji: '😮‍💨', question: 'When I am stressed, I…', choices: ['Clean everything in sight', 'Go very, very quiet', 'Talk it out with everyone', 'Nap. The problem can wait'] },
  { id: 'lost', emoji: '🧭', question: 'When I am lost, what do I do?', choices: ['Check the map immediately', 'Ask a stranger, no shame', 'Wander confidently in the wrong direction', 'Refuse to admit I am lost at all'] },
  { id: 'karaoke', emoji: '🎤', question: 'Karaoke night. What do I do?', choices: ['First on stage, no shame', 'Only after some convincing', 'Duet only — safety in numbers', 'Absolutely not, I am the audience'] },
  { id: 'competitive', emoji: '🏆', question: 'How competitive am I at board games?', choices: ['Terrifyingly. Friendships have ended', 'I want to win but I stay polite', 'I just like being included', 'I secretly help others win'] },
  { id: 'scary-movie', emoji: '👻', question: 'During a scary movie, I am…', choices: ['Completely unbothered', 'Hiding behind a pillow', 'Narrating everyone’s bad decisions', 'Asleep before the twist'] },
  { id: 'compliment', emoji: '☺️', question: 'How do I take a compliment?', choices: ['Own it — thank you, I know', 'Blush and change the subject', 'Immediately compliment you back', 'Argue that it is not true'] },
  { id: 'monday', emoji: '🗓️', question: 'My honest feeling about Mondays…', choices: ['Fresh start energy, love them', 'Neutral — just another day', 'Personal enemy number one', 'I lose track of what day it is'] },

  // ===== Preferences =====
  { id: 'movie-night', emoji: '🎬', question: "What's my movie night pick?", choices: ['A comfort movie I have seen 20 times', 'The newest big release', 'Something obscure with subtitles', 'A comedy — no thinking allowed'] },
  { id: 'vacation-style', emoji: '🏖️', question: "What's my dream vacation style?", choices: ['Beach, book, do absolutely nothing', 'City trip, itinerary in a spreadsheet', 'Mountains and hiking boots', 'Road trip with no fixed plan'] },
  { id: 'music', emoji: '🎧', question: 'What am I most likely listening to?', choices: ['The same playlist on repeat forever', 'Whatever is trending right now', 'Podcasts, mostly', 'A different genre every hour'] },
  { id: 'season', emoji: '🍂', question: "What's my favorite season?", choices: ['Summer — sun and long days', 'Autumn — sweaters and cozy vibes', 'Winter — blankets and holidays', 'Spring — fresh starts'] },
  { id: 'pet-pick', emoji: '🐶', question: 'If I could have any pet, I would pick…', choices: ['A dog, obviously', 'A cat, obviously', 'Something tiny — hamster, fish, bird', 'Something ridiculous, like a goat'] },
  { id: 'superpower', emoji: '🦸', question: 'Which superpower would I choose?', choices: ['Reading minds', 'Being invisible', 'Flying', 'Stopping time'] },
  { id: 'shopping', emoji: '🛍️', question: 'How do I shop?', choices: ['In and out with a list, mission mode', 'Hours of browsing, buys nothing', 'Impulse buys I regret by dinner', 'Online only — carts full of maybes'] },
  { id: 'texting-vs-calls', emoji: '📞', question: 'Text or call?', choices: ['Text, always — calls are an ambush', 'Call — texting takes too long', 'Depends entirely on my mood', 'Voice notes, the superior option'] },
  { id: 'window-aisle', emoji: '✈️', question: 'On a plane, I pick…', choices: ['Window — views and naps', 'Aisle — freedom and legroom', 'Middle, because I book late', 'Wherever is cheapest'] },
  { id: 'rainy-day', emoji: '🌧️', question: 'A rainy day means…', choices: ['Perfect cozy indoor day', 'Ruined plans, personally offended', 'Walk in it anyway', 'Nap weather, goodnight'] },

  // ===== Quirks =====
  { id: 'sing-car', emoji: '🚗', question: 'What do I do in the car?', choices: ['Full concert, windows down', 'DJ duty — the playlist is sacred', 'Backseat-drive from any seat', 'Fall asleep in ten minutes'] },
  { id: 'photos', emoji: '📸', question: 'My camera roll is mostly…', choices: ['Selfies, an alarming number', 'Food photos', 'Pets and random animals', 'Screenshots I will never look at again'] },
  { id: 'laugh', emoji: '😂', question: 'What is my laugh like?', choices: ['Loud enough to locate me in a crowd', 'Silent wheeze, tears included', 'A polite chuckle', 'A snort I pretend did not happen'] },
  { id: 'lost-items', emoji: '🔑', question: 'What am I always losing?', choices: ['My keys', 'My phone (while holding it)', 'My sunglasses', 'Nothing — I lose track of time instead'] },
  { id: 'dance', emoji: '🕺', question: 'My dancing can be described as…', choices: ['Actually good, no notes', 'Enthusiastic, zero technique', 'Strictly a two-step sway', 'Only after considerable convincing'] },
  { id: 'plants', emoji: '🪴', question: 'What happens to plants in my care?', choices: ['They thrive — green thumb certified', 'A 50/50 survival rate', 'They wilt out of spite', 'I only trust fake ones'] },
  { id: 'bed-side', emoji: '🛏️', question: 'How do I sleep?', choices: ['Starfish — the whole bed is mine', 'Curled in a neat little ball', 'Blanket thief, unrepentant', 'Same exact position all night'] },

  // ===== Emotional =====
  { id: 'cry', emoji: '🥹', question: 'What makes me cry?', choices: ['Sad movies, every single time', 'Happy things — weddings, reunions', 'Frustration more than sadness', 'Almost nothing, I am a rock'] },
  { id: 'love-language', emoji: '🎁', question: "What's my love language?", choices: ['Quality time together', 'Words — tell me you love me', 'Thoughtful little gifts', 'Acts of service — do the dishes'] },
  { id: 'comfort', emoji: '🫂', question: 'When I am sad, I want you to…', choices: ['Hug me and say nothing', 'Distract me — make me laugh', 'Help me fix the actual problem', 'Give me space, then snacks'] },
  { id: 'apology', emoji: '🙊', question: 'How do I apologize after an argument?', choices: ['A proper heartfelt talk', 'A meme that says sorry for me', 'Act extra nice and hope you notice', 'Snacks. Apology snacks'] },
  { id: 'proud-of', emoji: '🌟', question: 'What am I secretly proudest of?', choices: ['My taste in music', 'My cooking or baking', 'My sense of humor', 'How much my friends can count on me'] },
  { id: 'birthday', emoji: '🎂', question: 'What do I really want for my birthday?', choices: ['A big party with everyone', 'A quiet dinner with favorites only', 'A thoughtful handwritten letter', 'To be left alone with cake'] },
]

// Fisher–Yates pick of n random questions from the bank.
export function pickRandomQuestions(n: number): BankQuestion[] {
  const pool = [...QUIZ_BANK]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, n)
}
