// Editorial content for the admin-authored quiz pages (/quizzes/[slug]).
//
// The quiz itself (questions, options, results) lives in the `admin_quizzes`
// table and is played client-side, which means none of the result copy is in
// the server HTML. This file is the crawlable, human-readable half of the page:
// what the quiz measures, what each result means, and the questions people
// actually ask. Keyed by slug — a quiz with no entry here still renders, it
// just gets the bare player.

export type QuizContent = {
  slug: string
  intro: string[]                       // 2 paragraphs above the quiz
  sections: { heading: string; body: string[] }[]
  resultGuide: {
    heading: string
    intro: string
    bands: { label: string; body: string }[]   // mirrors admin_quizzes.results
  }
  faq: { q: string; a: string }[]
  related: { href: string; label: string }[]
}

export const QUIZ_CONTENT: QuizContent[] = [
  {
    slug: 'how-romantic-are-you',
    intro: [
      'Romance gets talked about as though it were a single trait — you either have it or you do not, and the people who have it are the ones booking rooftop dinners. That is not how it works in practice. Some people express love in language, some in planning, some in the thousand small maintenance acts that keep a shared life running. All of it is romance. Only one version of it photographs well.',
      'This quiz takes eight questions to place you among four romance styles. It is not a score, and there is no winning answer — the practical, unsentimental end of the range is a real way of loving someone, not a deficiency. What the result gives you is a name for your default, and a specific idea of what to do when your default is not quite reaching the person in front of you.',
    ],
    sections: [
      {
        heading: 'What this quiz actually measures',
        body: [
          'The eight questions are built around a single distinction: whether you express affection through gesture, through words, through consistency, or through solving problems. Each question puts you in an ordinary situation — a bad week for your partner, an anniversary you could mark or let pass, a moment when something goes unsaid — and asks what you would genuinely do rather than what sounds most romantic.',
          'That framing matters, because most "how romantic are you" quizzes reward performance. Answer as the most demonstrative version of yourself and you will score highly on those and learn nothing. Here, choosing the quiet answer moves you toward a different style, not a lower one.',
        ],
      },
      {
        heading: 'Why quiet romance gets undercounted',
        body: [
          'The romance that gets celebrated is the visible kind, which means the people who love in maintenance — the refilled coffee, the remembered appointment, the car quietly taken for its service — usually conclude they are not romantic. Their partners often disagree, sometimes strongly. The gap is not in the loving; it is that maintenance is invisible by design. Done well, it looks like nothing happened.',
          'This is also why written words do disproportionate work for people at that end of the range. If you rarely say the thing out loud, saying it once in writing carries a weight that a fluent romantic could not match with a whole week of gestures. Scarcity is doing some of the lifting, but so is the evidence: a letter proves you were paying attention the entire time, and names the specific things you noticed.',
        ],
      },
      {
        heading: 'What to do with your result',
        body: [
          'The useful move after any result is to try one thing slightly outside your default. If you are demonstrative, the stretch is restraint — one small, specific, unperformed thing instead of the big gesture. If you are practical, the stretch is saying out loud what you have been demonstrating for years.',
          'Writing is the cheapest place to run that experiment, because it is private, you can take your time, and nobody watches you draft it. Two hundred words naming three specific things you have noticed about someone will land harder than almost anything you could buy. If you want a starting structure, our guide to <a href="https://www.shareloveletters.com/blog/how-to-write-a-love-letter-to-your-boyfriend-or-girlfriend">writing a love letter</a> walks through it, and the <a href="https://www.shareloveletters.com/letters/love">love letter templates</a> give you an opening line if the blank page is the obstacle.',
        ],
      },
    ],
    resultGuide: {
      heading: 'The four romance styles',
      intro: 'Every answer maps to one of four styles. Here is what each one means before you take the quiz — and what it tends to need.',
      bands: [
        { label: '🌹 Hopeless Romantic', body: 'You compose love rather than merely feel it. Grand gestures are your first language and you are genuinely good at them. Your risk is volume: when everything is a gesture, the individual gesture stops carrying information. Your growth edge is the small, specific, unwitnessed thing.' },
        { label: '❤️ Warm-Hearted Romantic', body: 'Thoughtful and sincere without the theatre — you say the real thing at roughly the right moment. This is the most balanced result and the least in need of correction. If anything, you under-record: the things you say beautifully in the moment vanish, and writing a few of them down gives them a second life.' },
        { label: '🌿 Quiet Devotion', body: 'You love in deeds — the remembered detail, the problem handled before anyone noticed it. Words are not your first language, which is precisely why written words from you carry unusual weight. One short letter from you does more than a month of gestures from someone fluent.' },
        { label: '🧭 Practical Heart', body: 'You show love by making life work, and that is romance in sensible shoes. The failure mode is assuming it is legible. It often is not — competence reads as competence, not devotion — so the single highest-value thing you can do is state the motive out loud once, in writing.' },
      ],
    },
    faq: [
      { q: 'Is there a "best" result on this quiz?', a: 'No. The four styles are different expressions of the same thing, not a ranking. Warm-Hearted sits in the middle of the range, but a Practical Heart in a long marriage is doing at least as much work as a Hopeless Romantic in month three.' },
      { q: 'How accurate is a romance quiz?', a: 'Treat it as a mirror, not a diagnosis. Eight questions can reliably surface which style you default to, because people answer situational questions fairly honestly. What it cannot tell you is whether your partner feels loved — only they can, and asking them is a better use of ten minutes than any quiz.' },
      { q: 'Can my partner and I both take it?', a: 'That is the most useful way to use it. Take it separately, compare results, then talk about the gap. Mismatched styles are the ordinary cause of "you never say it" arguments, and seeing the mismatch named tends to defuse them faster than another round of the argument itself.' },
      { q: 'Is the quiz free, and do you keep my answers?', a: 'It is free with no account. The quiz runs in your browser and your individual answers are not stored against you — we count how many people started and finished each quiz, and nothing else.' },
      { q: 'What should I do if my result says I am not very romantic?', a: 'Write something. It is the one act available to every style, it costs nothing, and it converts an invisible pattern of care into something the other person can actually read. Two hundred specific words is enough.' },
    ],
    related: [
      { href: '/quizzes/what-letter-should-you-write', label: 'Which Letter Should You Write?' },
      { href: '/quizzes/apology-style-quiz', label: "What's Your Apology Style?" },
      { href: '/letters/love', label: 'Love letter templates' },
      { href: '/blog/how-to-write-a-love-letter-to-your-boyfriend-or-girlfriend', label: 'How to write a love letter' },
    ],
  },

  {
    slug: 'apology-style-quiz',
    intro: [
      'Most people have exactly one apology move. They repair fast and plainly, or they go quiet and think, or they reach for warmth and humour, or they skip the words and start fixing. It works until it meets a hurt that needed one of the other three, and then the apology lands wrong in a way that is genuinely confusing to the person giving it — they meant it, they said it, and somehow it made things worse.',
      'These eight questions identify which of those four you default to. The point is not to tell you your style is wrong. It is to show you where it runs out, because every apology style has a specific failure mode, and knowing yours is most of the work of fixing it.',
    ],
    sections: [
      {
        heading: 'Why apologies fail even when they are sincere',
        body: [
          'A sincere apology fails for one of three reasons: it arrives too fast to seem considered, it explains so much that it reads as defence, or it repairs the situation without ever acknowledging the feeling. None of these are insincerity. They are style mismatches — the shape of the apology did not fit the shape of the injury.',
          'The reliable test is whether the other person can tell that you understand what you did. Not that you regret it, and not that you want it over — that you have accurately modelled the harm. An apology that names the specific effect, in the other person\'s terms, does more work than any amount of expressed remorse.',
        ],
      },
      {
        heading: 'The part almost everyone skips',
        body: [
          'The strongest apologies contain something people find genuinely uncomfortable: a plain statement of what you will do differently, with no conditions attached to it. Not "I will try to be better if you tell me when it bothers you" — that hands the work back. Just the change, stated as a decision you have already made.',
          'The second commonly skipped element is silence afterwards. An apology that ends with a request — for a response, for forgiveness, for reassurance that things are fine — turns the moment back into something about your own comfort. Say the thing, then leave room.',
        ],
      },
      {
        heading: 'When to write it instead of saying it',
        body: [
          'Write it when the conversation keeps derailing, when one of you gets defensive faster than you can finish a sentence, or when the hurt is old enough that raising it in person would feel like an ambush. Writing removes the interruption and the flinch, and it lets you take three drafts to say something you would have said clumsily in one.',
          'Write it also when you need the other person to be able to re-read it. Spoken apologies are gone the moment they are finished, and the person who was hurt is frequently the least able to absorb them in real time. Our guide to <a href="https://www.shareloveletters.com/blog/how-to-write-an-apology-letter-that-heals">writing an apology letter that heals</a> covers the structure in detail, and the <a href="https://www.shareloveletters.com/letters/apology">apology letter templates</a> give you a first sentence when the first sentence is the problem.',
          'The one case for speaking rather than writing: when the hurt was small and recent. A letter for a minor thing inflates it, and can read as though you are building a case.',
        ],
      },
    ],
    resultGuide: {
      heading: 'The four apology styles',
      intro: 'Each answer maps to one of four styles. Here is what they mean, and the specific way each one tends to fall short.',
      bands: [
        { label: '🎯 The Straight Shooter', body: 'You own the mistake quickly and without decoration, which is rarer than it sounds. The limit is proportion — the same clean, fast apology that works for a missed call reads as dismissive after a real betrayal. Big hurts need evidence that you sat with it, and speed is the opposite of that evidence.' },
        { label: '📜 The Letter Writer', body: 'You apologise thoroughly and reflectively, which means you are already doing the thing most people avoid. Your risk is length: past a point, thoroughness starts to look like a case for the defence. Cut anything that explains why you did it unless they have asked.' },
        { label: '🌞 The Warmth Restorer', body: 'You repair the atmosphere with humour and affection, and you are usually good at it. The failure mode is arriving at warmth before acknowledgement — the other person feels the room lighten while their actual grievance goes unaddressed. Say the hard sentence first, then be warm.' },
        { label: '🔧 The Action Apologizer', body: 'You apologise by fixing things, which is admirable and frequently exactly right. But repair without words leaves the other person guessing whether you understood or merely noticed. A short honest note next to the action is the complete version.' },
      ],
    },
    faq: [
      { q: 'What is the best way to apologise?', a: 'Name the specific thing you did, name the effect it had in their terms rather than yours, say what you will do differently as a decision rather than an offer, and then stop. Do not attach a request for forgiveness — that makes the moment about your relief.' },
      { q: 'Should I apologise in writing or in person?', a: 'In person for small and recent things; in writing when the conversation keeps derailing, when the hurt is old, or when they will need to re-read it. Writing also lets you get it right on the third attempt instead of the first.' },
      { q: 'How long should an apology letter be?', a: 'Usually under 300 words. Length reads as either care or defensiveness depending on what fills it — if most of your draft explains your reasoning, cut it, because explanation and apology pull in opposite directions.' },
      { q: 'What if they do not respond?', a: 'That is a legitimate outcome and not a reason to send a second one. A good apology is given without conditions, including the condition of being answered. Sending a follow-up converts the apology into a request.' },
      { q: 'Can I apologise anonymously?', a: 'You can send a letter without signing it, though for apologies it is rarely the right call — a large part of what repairs the hurt is that you were willing to be identified. Anonymity fits better for encouragement or thanks.' },
    ],
    related: [
      { href: '/quizzes/how-romantic-are-you', label: 'How Romantic Are You?' },
      { href: '/quizzes/what-letter-should-you-write', label: 'Which Letter Should You Write?' },
      { href: '/letters/apology', label: 'Apology letter templates' },
      { href: '/blog/how-to-write-an-apology-letter-that-heals', label: 'How to write an apology letter that heals' },
    ],
  },

  {
    slug: 'best-friend-test',
    intro: [
      'Friendship is the closest relationship most people never formally assess. Romantic relationships get anniversaries, check-ins and the occasional difficult conversation about where things are going. Friendships just accumulate, and it is entirely possible to spend a decade as someone\'s closest person without either of you ever saying so.',
      'These nine questions look at the things that actually distinguish a best friend from a good one: whether you can be honest without managing each other, whether the effort is roughly symmetrical, and whether you would still call in a genuine crisis rather than only when things are going well. The result is a description, not a verdict — the lowest band is not a failing grade, it is the stage every long friendship passes through.',
    ],
    sections: [
      {
        heading: 'What separates a best friend from a good friend',
        body: [
          'Three things, mostly. The first is honesty without management — whether you can tell them something unwelcome without first rehearsing how to make it palatable. Most friendships never reach this, and it is the single clearest marker.',
          'The second is symmetry of effort over time. Not per exchange, which fluctuates for perfectly good reasons, but across a year. Friendships where one person consistently initiates tend to be described warmly by the initiator and vaguely by the other.',
          'The third is who you contact when things go badly rather than well. Plenty of people share good news widely and bad news with almost nobody. The list of people who get the bad news is the real one.',
        ],
      },
      {
        heading: 'Why long friendships drift without anyone deciding to end them',
        body: [
          'Friendships rarely break. They lapse — one move, one new job, one relationship that absorbs more time, and the contact rate quietly halves. Nobody notices, because nothing happened. The absence of a rupture is exactly what makes drift hard to catch.',
          'What reverses it is almost embarrassingly simple: someone says the unprompted thing. Not a plan to catch up soon, which both people know may not happen, but an actual statement of the friendship\'s value, delivered for no occasion. It is unusual enough to reset a drifting friendship in one move.',
        ],
      },
      {
        heading: 'How to say it without making it strange',
        body: [
          'The obstacle is tonal. Telling a friend they matter can tip into something that feels like a farewell or a crisis, and most people avoid it for that reason alone. Two things prevent it: be specific, and give no occasion. "I was thinking about the week you drove out to sit with me and we barely talked" is a memory. "You have always been there for me" is a eulogy.',
          'Written is easier than spoken here, precisely because it removes the need to hold eye contact through it. A short letter naming two or three specific things is enough — see our <a href="https://www.shareloveletters.com/blog/goodbye-letter-to-a-friend">guide to writing to a friend</a> for the structure, or start from the <a href="https://www.shareloveletters.com/letters/friendship">friendship letter templates</a>.',
        ],
      },
    ],
    resultGuide: {
      heading: 'The four friendship bands',
      intro: 'Nine questions place you in one of four bands. None of them are bad news — the lower two describe stages, not failures.',
      bands: [
        { label: '👑 Soulmate-Level Besties', body: 'Chosen family. Honesty flows both ways without management, effort is symmetrical, and you are on each other\'s crisis list. The only real risk here is assumption — friendships this solid go longest without anyone saying anything out loud, on the reasoning that it is obvious. It is obvious to you.' },
        { label: '🤝 True Best Friends', body: 'Trust, shared history and enough chaos to keep it interesting. You are past the stage where either of you performs. What tends to be missing is the record: years of this and no one has ever written any of it down.' },
        { label: '🌟 Great Friends, Growing Closer', body: 'A genuinely good thing with clear best-friend potential, usually still short on either shared time or shared difficulty. Friendships accelerate through unprompted sincerity more reliably than through more hangouts — this is the band where one letter changes the trajectory most.' },
        { label: '🌱 A Friendship in Bloom', body: 'Early. Every long friendship looked exactly like this once. The work here is frequency and initiative rather than depth, and the thing that most reliably converts a new friendship into a lasting one is being the person who reaches out first, repeatedly, without keeping score.' },
      ],
    },
    faq: [
      { q: 'What makes someone a best friend rather than a close friend?', a: 'Honesty without management, effort that is roughly symmetrical across a year, and being on the short list of people who hear bad news rather than only good. Duration matters far less than people assume — plenty of twenty-year friendships never reach the first of those.' },
      { q: 'Can we both take the test and compare?', a: 'Yes, and it is more informative than taking it alone. Matching results confirm what you both suspected; mismatched results are worth a conversation, because they usually mean one person is carrying more of the effort than the other has noticed.' },
      { q: 'Is it strange to tell a friend they mean a lot to you?', a: 'Only if it is vague or occasion-less in a way that reads as ominous. Anchor it to something specific — a particular week, a particular thing they did — and it lands as warmth rather than as a farewell.' },
      { q: 'How do I reconnect with a friend I have drifted from?', a: 'Skip the apology for the gap; it makes the gap the subject. Open with a specific memory instead, which signals you have been thinking about them rather than about your own guilt at not calling.' },
      { q: 'Is the quiz free?', a: 'Yes, free and no account. Your answers are not stored against you — we only count starts and completions per quiz.' },
    ],
    related: [
      { href: '/quizzes/how-romantic-are-you', label: 'How Romantic Are You?' },
      { href: '/quizzes/what-letter-should-you-write', label: 'Which Letter Should You Write?' },
      { href: '/letters/friendship', label: 'Friendship letter templates' },
      { href: '/blog/goodbye-letter-to-a-friend', label: 'Writing a letter to a friend' },
    ],
  },

  {
    slug: 'long-distance-relationship-quiz',
    intro: [
      'Long-distance relationships are usually discussed as an endurance problem — how long, how far, how often you can visit. In practice the couples who do well are not the ones with the shortest flights. They are the ones who have developed a specific mechanism for staying close, and who lean on it deliberately rather than hoping the relationship holds on general goodwill.',
      'These eight questions identify which mechanism is yours. There are four, all of them legitimate, and none of them is a complete strategy on its own. Knowing which one you rely on tells you where you are strong and, more usefully, which gap you are probably not covering.',
    ],
    sections: [
      {
        heading: 'The four ways couples survive distance',
        body: [
          'Some couples run on talk: everything gets said, nothing festers, the daily debrief is sacred. Some run on ritual: the good-morning message, the Sunday call, the shared show at the same time on the same night. Some run on planning: there is always a next visit booked, and the countdown does the emotional work. And some run on imagination — a vivid, shared, detailed picture of the life you are heading toward.',
          'Each of these covers a different failure mode. Talk handles resentment. Ritual handles the erosion of ordinary contact. Planning handles hopelessness. Imagination handles the question of what any of this is for. The reason the four matter is that a couple relying entirely on one is fully exposed to the failures the other three would have caught.',
        ],
      },
      {
        heading: 'The gap each superpower leaves',
        body: [
          'Communicators talk enough to process problems, but conversation is reactive by nature and can leave a relationship with no forward story. Ritual keepers have reliable contact that can quietly become obligation, where the Sunday call happens for eleven months without either person saying anything of consequence.',
          'Planners get real momentum from the next booked visit, but the relationship can become a series of countdowns with a flat, unattended stretch in between. Dreamers have the clearest sense of the destination and are the most likely to be vague about the route — the shared future is vivid, and the question of who moves, when, and what it costs stays comfortably unexamined.',
        ],
      },
      {
        heading: 'Why written letters do specific work at distance',
        body: [
          'Long-distance couples are not short on communication. They are short on permanence. Messages and calls are high-volume and completely disposable — thousands of exchanges and nothing you can hold, re-read on a bad night, or find again in two years.',
          'A letter is the one form of contact at distance that survives being finished. It also removes the biggest constraint of a video call, which is that both of you are performing being fine in real time. Writing lets you say the harder, more considered thing without watching the other person absorb it.',
          'A letter timed to arrive on a specific day does a third job: it puts something in the calendar that is not a visit. If your <a href="https://www.shareloveletters.com/letters/long-distance">long-distance letter</a> is scheduled to unlock on a date you both know about, the waiting has an event in it. And if you want the practical version, our <a href="https://www.shareloveletters.com/blog/long-paragraphs-for-him">long paragraphs</a> collections are built for exactly this kind of message.',
        ],
      },
    ],
    resultGuide: {
      heading: 'The four LDR superpowers',
      intro: 'Every answer maps to one of four strengths. Here is what each is good at — and the specific gap it leaves open.',
      bands: [
        { label: '💬 The Communicators', body: 'Words are your mechanism. Nothing festers because everything gets said, and you will out-survive most couples on conflict alone. Your gap is forward motion: talking is reactive, and a relationship that processes brilliantly can still lack any agreed sense of where it is going.' },
        { label: '⏰ The Ritual Keepers', body: 'Consistency is your mechanism — the good-morning text, the Sunday call, the standing date. Rituals are how you say "you can count on me" without saying it. Your gap is depth: reliable contact can become routine contact, where the call happens every week and nothing real is said in it.' },
        { label: '🗺️ The Reunion Planners', body: 'Hope with a booking reference. Always having a next visit is genuinely protective — it converts an open-ended wait into a finite one. Your gap is the middle: the stretch between countdowns can go unattended, because the plan is doing the emotional work that presence should be doing.' },
        { label: '🌌 The Dreamers', body: 'Imagination is your mechanism, and you have the clearest answer to what this is all for. Your gap is logistics: a vivid shared future with no agreed route is the most common way a long-distance relationship stalls without anyone deciding to end it. Name a date, even a provisional one.' },
      ],
    },
    faq: [
      { q: 'What makes long-distance relationships work?', a: 'A deliberate mechanism for closeness rather than general goodwill, plus an agreed end point. Research and experience both point the same way: couples with a concrete plan for closing the distance do markedly better than couples with an open-ended arrangement, regardless of how well they communicate.' },
      { q: 'How often should long-distance couples talk?', a: 'Less than most people assume, and more deliberately. Daily contact that is genuinely present beats constant contact where both of you are half-attending. The failure mode is quantity substituting for quality — a relationship can be in near-permanent contact and still have nothing of substance said in a month.' },
      { q: 'What can I send instead of another text?', a: 'A letter, and ideally one scheduled to arrive on a day they will need it. It is the only common form of long-distance contact that still exists after it has been read, which is exactly what messaging cannot do.' },
      { q: 'Can I schedule a letter to open on a specific date?', a: 'Yes. Write it now, set the date it unlocks, and the link stays sealed behind a countdown until then. It is free and needs no account on either side.' },
      { q: 'Does this quiz work if we are only temporarily apart?', a: 'Yes. Deployments, long work postings and study abroad create the same dynamics as permanent distance, and the same four mechanisms apply.' },
    ],
    related: [
      { href: '/quizzes/how-romantic-are-you', label: 'How Romantic Are You?' },
      { href: '/quizzes/what-letter-should-you-write', label: 'Which Letter Should You Write?' },
      { href: '/letters/long-distance', label: 'Long-distance letter templates' },
      { href: '/blog/long-paragraphs-for-her', label: 'Long paragraphs to send her' },
    ],
  },

  {
    slug: 'what-letter-should-you-write',
    intro: [
      'Most people who want to write a letter already know it. What they do not know is which one — there is a person in mind and a feeling attached, but the feeling is doing several things at once, and it is genuinely hard to tell from the inside whether what you owe someone is an apology, a thank-you, or a plain statement of how you feel.',
      'These eight questions sort that out. They ask about who has been on your mind, what you keep almost saying, and what you would regret leaving unsaid, and they point at one of four letters. The result is a starting point rather than a prescription — but starting at the right kind of letter saves most of the difficulty.',
    ],
    sections: [
      {
        heading: 'The four letters almost everyone owes someone',
        body: [
          'A love letter, when the feeling is present and full and simply has not been put into words. An apology, when there is a specific relationship you avoid thinking about directly. A thank-you, when someone changed the direction of your life and has no idea you know it. And a letter to your future self, when the thing you want to preserve is not about another person at all but about who you are right now.',
          'These cover most of what goes unsaid. The reason people stall is not usually that they cannot write — it is that the impulse arrives undifferentiated, as a general sense of something owed, and a general sense of something owed produces nothing.',
        ],
      },
      {
        heading: 'Why the thank-you is the most skipped',
        body: [
          'Almost everyone can name a person who altered the course of their life — a teacher, a manager, a friend\'s parent, someone who said one accurate thing at the right moment. Almost nobody tells them. The reason is a peculiar assumption that it is too late, or that the person has surely been told by others, or that they would not remember you.',
          'They generally have not been told, and they generally do remember. Of all four letters, the thank-you has the highest ratio of impact to difficulty, because the recipient is not braced for it. A <a href="https://www.shareloveletters.com/blog/thank-you-letter-to-teacher">letter to a teacher</a> years after the fact is routinely described by teachers as the best thing they have received in their career, and it costs an evening.',
        ],
      },
      {
        heading: 'If your result is not the letter you expected',
        body: [
          'That happens often, and it is usually worth sitting with rather than retaking. The most common surprise is landing on an apology when you were expecting a love letter, which tends to mean there is something unresolved sitting underneath the affection and blocking it. Writing the affectionate letter first rarely works in that situation — it reads, to the person receiving it, as though you are talking past something.',
          'The second common surprise is the future-self letter, which people expect to be a novelty and often find is the one they most needed. It requires no courage about another person, which makes it the easiest of the four to actually finish. Our <a href="https://www.shareloveletters.com/blog/letter-to-my-future-self-examples">letter to my future self examples</a> give you ten to work from, and <a href="https://www.shareloveletters.com/letters/future-self">a place to seal one behind a date</a>.',
          'You can also just write two. Nothing about this requires picking one.',
        ],
      },
    ],
    resultGuide: {
      heading: 'The four possible results',
      intro: 'Eight questions point you at one of these four. Here is what each result means and what to do first.',
      bands: [
        { label: '💖 A Love Letter Is Waiting', body: 'The feeling is present and full — the pen is the only step left. Your answers pointed at someone specific rather than a general warmth, which is the condition under which love letters actually get finished. Start with one concrete memory rather than a statement of feeling; the feeling arrives on its own once the memory is on the page.' },
        { label: '🕊️ An Apology Wants Out', body: 'There is a relationship you keep looking at and moving past. A written apology works here precisely because the conversation has probably failed before — writing removes the interruption, the defensiveness and the flinch. Name the specific thing and its effect, say what changes, and do not ask for anything back.' },
        { label: '🌻 A Thank-You Letter Is Overdue', body: 'Gratitude ran through your answers, aimed at someone who almost certainly does not know. This is the lowest-risk and highest-return letter of the four — nobody has ever been made uncomfortable by being told they mattered, provided you are specific about how.' },
        { label: '🔮 A Letter to Your Future Self', body: 'You are in a season of change and the thing worth preserving is who you are in the middle of it. This is the one letter that needs no courage about another person. Write what you are afraid of and what you are hoping for, seal it behind a date a year out, and forget about it.' },
      ],
    },
    faq: [
      { q: 'What kind of letter should I write?', a: 'It depends on which feeling is actually driving the impulse. If it is affection with a specific person attached, a love letter. If there is a relationship you keep avoiding thinking about, an apology. If someone changed your direction, a thank-you. If the thing you want to hold onto is about you rather than anyone else, a letter to your future self.' },
      { q: 'What if I get a result I did not expect?', a: 'Sit with it before retaking. Landing on an apology when you expected a love letter usually means something unresolved is sitting under the affection — and the affectionate letter tends not to land until that is dealt with.' },
      { q: 'Can I write more than one?', a: 'Yes, and many people should. The quiz picks the most pressing, not the only one. There is no limit and no account required.' },
      { q: 'Do I have to send it?', a: 'No. Unsent letters are a legitimate form — particularly apologies to people who are no longer reachable, and letters to someone who has died. The writing does most of the work whether or not anyone reads it.' },
      { q: 'Is it free, and is it private?', a: 'Free, with no account. Letters are encrypted and reachable only through the private link you choose to share; they are never listed publicly and never indexed by search engines.' },
    ],
    related: [
      { href: '/quizzes/how-romantic-are-you', label: 'How Romantic Are You?' },
      { href: '/quizzes/apology-style-quiz', label: "What's Your Apology Style?" },
      { href: '/letters', label: 'All letter types' },
      { href: '/blog/letter-to-my-future-self-examples', label: 'Letter to my future self: 10 examples' },
    ],
  },
]

export function getQuizContent(slug: string): QuizContent | undefined {
  return QUIZ_CONTENT.find(c => c.slug === slug)
}
