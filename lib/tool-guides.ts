// Editorial guidance for the /tools/[slug] pages.
//
// Every tool is a client-side widget, which means the interactive part of the
// page contributes nothing a crawler or a first-time reader can use. These are
// the sections rendered underneath it: how to actually use the thing, what it
// is good for, and the honest limits. Keyed by tool slug — a tool with no
// entry still renders, it just gets the widget, intro and FAQ.

export type ToolGuide = {
  slug: string
  // Rendered as a numbered "how it works" strip directly under the widget.
  steps?: { title: string; text: string }[]
  sections: { heading: string; body: string[] }[]
}

export const TOOL_GUIDES: ToolGuide[] = [
  {
    slug: 'love-calculator',
    steps: [
      {
        title: 'Type both names',
        text: 'First names are enough. Nicknames and spellings change the result, so pick one version of each name and stay with it if you want a score you can compare later.',
      },
      {
        title: 'Read the score',
        text: 'You get a percentage and a short line describing it. There is no randomness involved, so refreshing the page will not improve your number — which is most of the fun.',
      },
      {
        title: 'Send it, then say something real',
        text: 'Screenshot it for the laugh. Then follow it with one sentence that is actually about them, because the number on its own tells the other person nothing.',
      },
    ],
    sections: [
      {
        heading: 'What a love calculator can and cannot tell you',
        body: [
          'A name-based compatibility score is a game, and it is worth being straightforward about that: the letters in two names carry no information about whether two people are good for each other. What the calculator does reliably is produce the same score for the same pair every time, which is what makes it shareable — you and your friend get the same number, so there is something to argue about.',
          'The reason these have survived since the paper-and-pencil playground version is not that anyone believes them. It is that they give you permission to raise the subject. Typing two names into a box is a much lower-stakes way of asking "are we a thing?" than asking directly, which is precisely why it has outlived every more sophisticated version of the idea.',
        ],
      },
      {
        heading: 'Why the same names always give the same score',
        body: [
          'The calculation is deterministic. Every letter in the two names is converted to a number, the numbers are combined in a fixed way, and the result is reduced to a value between 0 and 100. Nothing is random and nothing is stored, so the same pair of names typed on a different day, on a different phone, by a different person returns exactly the same figure.',
          'That is the property that makes it worth playing with. A random number would be meaningless the moment two people compared results; a stable one behaves like a fact you can send to someone. It also means the score is sensitive to spelling in ways people find funny — the full name and the shortened one give different results, as do a maiden name and a married one. None of it means anything, and everyone knows it, which is why nobody minds.',
        ],
      },
      {
        heading: 'What actually predicts compatibility',
        body: [
          'The research on relationship stability is fairly consistent, and none of it involves names. The strongest predictors are how couples handle disagreement — whether criticism stays about the behaviour rather than the person, whether either party withdraws entirely — plus shared expectations about the practical shape of a life, and the ratio of positive to negative interactions in ordinary time rather than during conflict.',
          'None of this is as fun as a number out of 100. But if the score sent you looking for something more substantial, the honest version of the exercise is a conversation about what you each expect, and our <a href="/tools/couples-questions">couples questions</a> are built to start exactly that.',
        ],
      },
      {
        heading: 'What to do with a high score',
        body: [
          'Screenshot it, send it, enjoy the two minutes. Then, if the number happened to land on something real, say the real thing. A score is a prompt, not a message — the person on the other end of it learns nothing about how you feel from a percentage.',
          'A short letter naming two or three specific things you have noticed about them does what the number is standing in for. It takes about ten minutes, it costs nothing, and unlike a screenshot it is still there in a year.',
        ],
      },
    ],
  },
  {
    slug: 'days-together',
    steps: [
      {
        title: 'Choose the day it started',
        text: 'Your first date, the day you made it official, the day you met — any origin works. The counter measures from whatever date you give it.',
      },
      {
        title: 'Read the totals',
        text: 'You get the exact number of days alongside the equivalent in months and years, plus how far it is to the next round milestone.',
      },
      {
        title: 'Put the next milestone in a calendar',
        text: 'The useful output is the date ahead of you, not the number behind you. Set a reminder a week early so there is time to do something with it.',
      },
    ],
    sections: [
      {
        heading: 'Why day counts land harder than year counts',
        body: [
          'Anniversaries are annual and therefore expected, which quietly drains them of impact — everybody knows the date is coming, and the marking of it becomes an obligation as much as a celebration. A day count does something different. Four years reads as a category; 1,514 days reads as an accumulation, and accumulation is closer to what a relationship actually feels like from the inside.',
          'This is also why day counts make unusually good surprises. Nobody is braced for day 1,000. Arriving with something on a date that carries no social obligation is one of the few remaining ways to mark a relationship without the marking being anticipated.',
        ],
      },
      {
        heading: 'Choosing a start date when there is no obvious one',
        body: [
          'Plenty of relationships have a fuzzy beginning: a long stretch of ambiguity, a friendship that shifted, a first date nobody would have called a date at the time. If you cannot identify a single day, the practical answer is to pick the first one either of you can name precisely and treat it as the official origin. A slightly arbitrary date you both agree on is far more useful than an accurate one neither of you can remember.',
          'Couples who genuinely disagree — one counts from the first kiss, the other from the day they stopped seeing other people — often end up keeping both, which is not a problem. Run the counter twice and you have two milestones a few weeks apart instead of one, and the second is arguably the better surprise because nobody is expecting it.',
        ],
      },
      {
        heading: 'The milestones worth catching',
        body: [
          'The round numbers are the obvious ones — 100, 500, 1,000, 5,000 days — and 1,000 in particular tends to fall at an unremarkable point in year three, which is exactly when a relationship benefits most from being noticed. Beyond those, 10,000 days lands a little past twenty-seven years and is worth putting in a calendar the moment you find it.',
          'Some couples prefer counting from a different origin than the official one: the first conversation, the day one of you moved cities, the day you decided something. The counter does not care which date you give it, and the less obvious origins usually make the better story.',
        ],
      },
      {
        heading: 'What to do when you hit one',
        body: [
          'The failure mode is announcing the number and stopping there. A count is data; it becomes a gift only when you attach something to it. The simplest version that works: name the number, then name one thing from that stretch of time that you have never actually said out loud.',
          'If you want it to arrive on the day itself rather than whenever you remember, write it now and schedule it. A letter <a href="/letters/anniversary">sealed until a specific date</a> turns a number you found on a Tuesday into something that shows up exactly when it means something.',
        ],
      },
    ],
  },
  {
    slug: 'nickname-generator',
    steps: [
      {
        title: 'Pick a vibe',
        text: 'Sweet and classic, playful and silly, cute and soft, or deeply romantic. The category matters more than the individual names — most people find what they want by noticing which group they keep returning to.',
      },
      {
        title: 'Generate until something snags',
        text: 'Six names come up at a time and you can keep drawing. You are not looking for the perfect one so much as the one that makes you laugh or wince — both are information.',
      },
      {
        title: 'Test it in private first',
        text: 'Use it once, quietly, and watch the reaction. A pet name that survives a week of ordinary use has been accepted; one that gets no reply has not.',
      },
    ],
    sections: [
      {
        heading: 'What makes a pet name stick',
        body: [
          'Generated nicknames are a starting point rather than an answer, and it is worth knowing why: the pet names that survive are almost never chosen. They emerge from an incident — a mispronunciation, a running joke, something one of you said at 2am — and their whole value is that they are unshareable. Nobody outside the relationship knows why it is funny.',
          'What a generator is genuinely good for is breaking the deadlock. If you have been together a while and still default to first names, browsing thirty options tends to surface the category you actually want — sweet, silly, ironic, food-based — even if you end up using none of the specific suggestions.',
        ],
      },
      {
        heading: 'Reading the room before you commit',
        body: [
          'Pet names carry more social risk than people expect, largely because their acceptable range is so personal. Some people find diminutives affectionate and some find them faintly patronising, and there is no way to tell from the outside which one you are dealing with. The reliable approach is to test privately before ever using one in front of other people.',
          'Two practical rules. Avoid anything that comments on appearance or size, which ages badly and lands differently on a bad day than a good one. And watch what they call you back — reciprocation is the clearest signal that a name has been accepted, and its absence over a few weeks is usually an answer.',
        ],
      },
      {
        heading: 'The nicknames that age badly',
        body: [
          'A few categories reliably cause trouble later. Anything referencing a body — height, weight, a feature — is affectionate at the start of a relationship and a liability during an argument five years in, because it hands the other person a permanent sore point. Anything you used with a previous partner should be retired entirely; it will surface eventually and it will not be received well.',
          'The other one people underestimate is scale. Baby-talk names that work between two people can be genuinely uncomfortable in front of colleagues, in-laws or children, and the person being called it is often the last to say so. A good test is whether you would use it in a voice note they might play out loud. If the answer is no, keep it, but keep it private — and be sure they know that is the arrangement rather than assuming it.',
        ],
      },
      {
        heading: 'Where nicknames belong in writing',
        body: [
          'A pet name at the top of a letter does a specific job: it establishes immediately that this is private correspondence rather than a message that could have been sent to anyone. It is the fastest available signal of intimacy, which is why it works so well as an opening.',
          'Use it once, at the start, and then write normally. Repeated pet names through a letter start to read as filler — as though the affection is carried by the label rather than by anything you have actually said. Our <a href="/blog/how-to-write-a-love-letter-to-your-boyfriend-or-girlfriend">guide to writing a love letter</a> covers the rest of the structure.',
        ],
      },
    ],
  },
  {
    slug: 'love-language-quiz',
    steps: [
      {
        title: 'Answer for how you receive, not how you give',
        text: 'Six questions, and each one asks which gesture would make you feel loved — not which one you tend to offer. People routinely give in one language and receive in another.',
      },
      {
        title: 'Take the first answer',
        text: 'Go with instinct rather than the answer you think describes the person you would like to be. Deliberating produces a tidier result and a less accurate one.',
      },
      {
        title: 'Compare, then ask one question',
        text: 'Have your partner take it separately. Then ask each other what you actually noticed in the past month — the gap between the results and that answer is the whole point.',
      },
    ],
    sections: [
      {
        heading: 'What the five love languages are actually claiming',
        body: [
          'The framework proposes that people have a primary channel through which affection registers — words, quality time, acts of service, gifts, or physical touch — and that couples routinely give love in their own channel while their partner is listening on a different one. The claim is less about what people want than about what they notice.',
          'It is worth saying that the five-category model is a popular framework rather than a validated psychological instrument; research has generally not found that people sort cleanly into one primary language, or that matched couples do better. What it does well is give two people a shared vocabulary for a mismatch they had both felt and neither could name, and that is a real contribution regardless of the underlying taxonomy.',
        ],
      },
      {
        heading: 'The mismatch this explains',
        body: [
          'The classic pattern: one person expresses love by handling things — the car, the bills, the logistics — and the other experiences a relationship in which nothing is ever said. Both are giving generously. Neither is receiving, because each is transmitting on their own frequency and assuming the signal is obvious.',
          'The fix is not usually to change what you do. It is to say what it was for. Acts of service become legible the moment they are narrated once, and narration is cheap.',
        ],
      },
      {
        heading: 'Why your result can change',
        body: [
          'People take this expecting a fixed trait and are unsettled when a retake a year later comes out differently. It usually should. What registers as love is shaped by what is currently scarce: couples in the same house rarely name quality time, and couples six months into a long-distance stretch name almost nothing else. New parents frequently shift toward acts of service for a while, then shift back.',
          'So treat the result as a reading of where you are now rather than a permanent classification, and retake it when circumstances change rather than trying to reconcile the new answer with the old one. The version that matters is the one that describes this year — that is the one your partner has to work with.',
        ],
      },
      {
        heading: 'Using your result well',
        body: [
          'Take it as a description of where you are currently tuned rather than a fixed trait. The genuinely useful step is comparing results with your partner and asking one question: what did I do in the last month that you actually registered? The answers are frequently surprising, and more informative than either quiz result.',
          'If words came out high for either of you, that has a direct application — write it down. If words came out low, writing still helps, because the record survives in a way that a spoken moment does not. Our <a href="/quizzes/how-romantic-are-you">romance style quiz</a> looks at a related question from a different angle.',
        ],
      },
    ],
  },
  {
    slug: 'anniversary-gifts',
    steps: [
      {
        title: 'Enter the year',
        text: 'Any year from the first upward. The tool returns the traditional material and the modern equivalent side by side rather than making you choose a list first.',
      },
      {
        title: 'Read the material as a category',
        text: 'Paper, cotton, leather and the rest are prompts. The useful step is asking what that material means to the two of you, not what shop sells it.',
      },
      {
        title: 'Write the card before you buy the thing',
        text: 'It is the part they will still have in ten years, and doing it first tends to change what you buy.',
      },
    ],
    sections: [
      {
        heading: 'Where the traditional list came from',
        body: [
          'The traditional anniversary materials — paper, cotton, leather, and onward through wood, tin and silver to gold — are largely a Victorian-era codification of older European customs, and the modern parallel list (clocks, china, appliances) was assembled in the twentieth century, substantially by retail associations. Neither is ancient and neither is binding.',
          'What makes the list useful anyway is constraint. An open-ended search for a gift produces either nothing or something generic; being told this year is paper narrows the field enough to think properly. The material is a prompt, not an obligation.',
        ],
      },
      {
        heading: 'How to use a material without being literal',
        body: [
          'The first year is paper, and the failure mode is buying a notebook. The interesting reading of paper is anything that carries information — a letter, tickets to something you booked without asking, a printed photograph from a year nobody documented properly.',
          'The same reframe works down the list. Cotton in year two is a shirt only if you have nothing better; it is also the blanket from the flat you shared. Leather in year three is a wallet, or the repaired version of something they already own and would not replace. The material is best treated as a category of meaning rather than a shopping instruction.',
        ],
      },
      {
        heading: 'When the two lists disagree',
        body: [
          'For most years the traditional and modern materials have nothing to do with each other — year eight is bronze traditionally and linen or lace in the modern list, and there is no reconciling them. There is no authority to appeal to here, so the sensible approach is to look at both, notice which one suggests something specific about your partner, and ignore the other completely.',
          'The lists also assume a wedding, which increasingly does not apply. Unmarried couples, friendships and the anniversary of the day you met all borrow the same materials perfectly well, because the sequence has no legal content — it is just an escalating series of prompts that happens to start with paper. If you are counting from something other than a wedding, our <a href="/tools/days-together">days together counter</a> will tell you which year you are actually in.',
        ],
      },
      {
        heading: 'The part of the gift that gets remembered',
        body: [
          'Gifts are recalled poorly and the accompanying note is recalled well, which is close to the reverse of how most people allocate effort. Almost everyone can quote something written to them years ago; far fewer can list what came with it.',
          'So whatever the material, write the card properly — not "happy anniversary, love you", but one specific thing about this particular year. If you want the longer version, the <a href="/letters/anniversary">anniversary letter templates</a> give you a structure, and it takes about fifteen minutes.',
        ],
      },
    ],
  },
  {
    slug: 'countdown',
    steps: [
      {
        title: 'Pick the date and time',
        text: 'Add a time if the moment is specific — a landing, a ceremony, midnight. The countdown starts immediately and updates every second.',
      },
      {
        title: 'Keep the link somewhere you will see it',
        text: 'Your date is encoded into the share link, so bookmarking it or sending it to the person you are waiting for reopens the same countdown rather than a blank one.',
      },
      {
        title: 'Decide what happens at zero',
        text: 'The number reaching zero is an anticlimax on its own. Plan something small to land at the same moment — that is what the countdown has been pointing at.',
      },
    ],
    sections: [
      {
        heading: 'Why waiting for something feels better than having it',
        body: [
          'Anticipation is unusually efficient at generating enjoyment. Studies of holidaymakers have repeatedly found that the weeks before a trip produce more measurable happiness than the trip itself, and the mechanism is not mysterious: an imagined future event has none of the friction of the real one, and it can be enjoyed repeatedly.',
          'A countdown externalises that. It converts a vague future into a specific, shrinking number, and it gives both people something to look at that is not the distance between now and then. For couples apart, that is not a small thing — an open-ended wait is materially harder to sit with than a finite one, even when the finite one is longer.',
        ],
      },
      {
        heading: 'What to point it at',
        body: [
          'Reunions and flights are the obvious use, and the most common. Beyond those: a wedding, a due date, a move, the end of a deployment or a posting, a first anniversary, or the day someone finishes a course of treatment. The tool does not care what the date means.',
          'One thing worth avoiding is pointing a countdown at something genuinely uncertain. A shrinking number attached to a date that then moves does the opposite of what you wanted, and it is better to count toward something fixed and modest than something exciting and provisional.',
        ],
      },
      {
        heading: 'Time zones, and the last week',
        body: [
          'If the two of you are in different countries, agree whose clock the countdown is set to before you both start watching it, because a six-hour offset means one of you hits zero on the wrong evening. The usual convention is to set it to the time zone where the event physically happens — the airport, the venue, the front door.',
          'The other thing to expect is that the final week behaves differently from the rest. A countdown measured in months is soothing; the same countdown measured in hours tends to sharpen the wait rather than ease it, which is the point at which people start checking it compulsively. If that is happening, the honest move is to stop looking and go and do something, and let the day arrive on its own.',
        ],
      },
      {
        heading: 'Pairing a countdown with something that arrives',
        body: [
          'A countdown creates a moment but does not fill it — the number reaches zero and there is nothing at the bottom of it. The natural completion is something timed to arrive exactly then.',
          'You can write a letter now and <a href="/letters/future-self">seal it until the date the countdown ends</a>. It stays locked behind its own countdown until then, which means the person waiting gets both the anticipation and something waiting for them at the end of it. For couples apart, our <a href="/letters/long-distance">long-distance letters</a> are built around this pattern.',
        ],
      },
    ],
  },
  {
    slug: 'zodiac-compatibility',
    steps: [
      {
        title: 'Pick both star signs',
        text: 'These are sun signs, taken from the birth date. If a birthday falls on the boundary between two signs, try both — the readings differ and the contrast is often the interesting part.',
      },
      {
        title: 'Read the score and the element note',
        text: 'The score comes from how the two elements — fire, earth, air, water — traditionally interact. The short read explains what that pairing is usually said to mean.',
      },
      {
        title: 'Use it as a prompt, not a verdict',
        text: 'The useful bit is the description of the contrast between two temperaments. Take that to a conversation and leave the score behind.',
      },
    ],
    sections: [
      {
        heading: 'How to read a compatibility result',
        body: [
          'Astrological compatibility is not predictive — there is no evidence that birth month influences relationship outcomes, and the studies that have looked have found nothing. This page treats it as what it is: a structured, entertaining lens for talking about two people.',
          'That framing is not a dismissal. The reason sign-based readings persist is that they describe recognisable personality contrasts and give them names, and having a name for "one of you needs to process out loud and the other needs an hour alone first" is genuinely useful even when the naming system is arbitrary.',
        ],
      },
      {
        heading: 'What the elements are actually describing',
        body: [
          'The four-element grouping — fire, earth, air, water — maps onto contrasts that are easy to recognise: expressive versus reserved, concrete versus abstract, fast-moving versus deliberate. Traditional readings pair like with like, which is why fire-and-fire or earth-and-earth results read as harmonious.',
          'The more interesting cases are the mismatches, and traditional astrology is unhelpfully pessimistic about them. In practice the pairings described as difficult are the ones with the most to negotiate and, when negotiated, the most range. A low compatibility score is a list of things to talk about, not a verdict.',
        ],
      },
      {
        heading: 'A sun sign is only part of a chart',
        body: [
          'What this tool uses is the sun sign — the one you get from a birth date alone, and the only one most people know. Within astrology itself that is a deliberately shallow reading. A full chart also places the moon, which is said to govern how someone handles feeling, and the rising sign, which covers how they come across before anyone knows them, and both require a birth time and place to calculate.',
          'This matters mostly because it explains the common complaint that a reading does not sound like you at all. Two people born under the same sun sign can be described very differently once the rest of the chart is involved, which is why serious practitioners treat sun-sign compatibility as a party trick. We use it here for the same reason: it needs one piece of information each, it produces a recognisable sketch, and nobody has to hand over their birth certificate.',
        ],
      },
      {
        heading: 'The better question underneath',
        body: [
          'Whatever the reading says, the useful question it points at is how each of you handles conflict, distance and repair — which is a conversation you can have directly and which no chart will answer for you.',
          'If the result landed well, say something real to the person it was about. Our <a href="/quotes/love">love quotes</a> are a decent starting line if you want one, and a <a href="/letters/love">love letter</a> is the version of this that they will still have when the reading is forgotten.',
        ],
      },
    ],
  },
  {
    slug: 'couples-questions',
    steps: [
      {
        title: 'Choose a category',
        text: 'Deep for the ones that open something, fun for a lighter evening, date night for questions that keep a table conversation moving.',
      },
      {
        title: 'Both of you answer',
        text: 'Take turns on every question. One-sided questioning turns into an interview within about four questions and people start managing their answers.',
      },
      {
        title: 'Follow up once, then move on',
        text: 'Ask one more question about whatever they said before drawing the next card. The first answer is usually rehearsed; the second is where something real appears.',
      },
    ],
    sections: [
      {
        heading: 'Why prepared questions work better than they should',
        body: [
          'Couples who have been together a while develop a conversational groove — logistics, work, whatever is immediately in front of them — and the groove is efficient enough that nothing forces you out of it. It is entirely possible to talk every day for years and not learn anything new about each other.',
          'A prepared question breaks the pattern by removing the awkwardness of raising something out of nowhere. Asking "what did you think of me when we first met?" unprompted is a slightly loaded move; drawing it from a list is not. The card is doing social work, not intellectual work.',
        ],
      },
      {
        heading: 'How to actually use them',
        body: [
          'Two rules make the difference. Both people answer every question — one-sided questioning turns quickly into an interview and people become guarded. And follow up at least once before moving on, because the first answer is nearly always the rehearsed one and the second is where anything real appears.',
          'Pace matters too. Three or four questions in an evening is plenty; working through thirty converts a conversation into a task. And skipping is allowed — "not tonight" is a legitimate answer and treating it as one is what makes the harder questions safe to ask later.',
        ],
      },
      {
        heading: 'When a question opens something you were not expecting',
        body: [
          'Occasionally one of these lands on a genuine sore point — an old resentment, a fear about the future, something one of you has been carrying quietly. This is not a failure of the exercise, but it does change what the evening is, and the useful thing is to notice that and stop drawing cards. Continuing down the list after something real has surfaced is a way of avoiding it while appearing to be having a deep conversation.',
          'The other half of the rule is what you do with an answer. Nothing said during one of these evenings should be repeated to other people, and nothing should be produced as evidence in an argument three weeks later. Questions like these are only safe to ask because both people assume that; the first time the assumption is broken, the honest answers stop and they do not come back easily.',
        ],
      },
      {
        heading: 'What to do with a good answer',
        body: [
          'The best answers from these evenings are almost always lost, because they arrive in conversation and conversation does not persist. If something lands — a memory you had never heard, a fear neither of you had named — write it down that week.',
          'Putting it in a letter back to them does two things: it proves you were listening, and it makes the moment survive. If you want a way in, a <a href="/letters/just-because">just-because letter</a> needs no occasion, which is exactly the point.',
        ],
      },
    ],
  },
  {
    slug: 'love-note',
    steps: [
      {
        title: 'Write one line',
        text: 'A sentence or two is the format. Anything longer belongs in a letter, where it has room to be read properly.',
      },
      {
        title: 'Copy the link',
        text: 'Your words are encoded into the link itself in your own browser. Nothing is uploaded, which also means the link is the only copy.',
      },
      {
        title: 'Send it and say nothing else',
        text: 'Paste it into a message on its own. Explaining what is in the link before they open it removes the entire reason for wrapping it in one.',
      },
    ],
    sections: [
      {
        heading: 'When a note beats a letter',
        body: [
          'Not everything needs three paragraphs. A single line — thinking about you, good luck today, I am sorry about this morning — often does the whole job, and stretching it into a letter dilutes it. The note format exists for the times when the message is one sentence and the sentence is enough.',
          'What the reveal adds is a small amount of ceremony. The same words sent as a message are read in the middle of everything else; behind a link that opens like an envelope, they get a second of attention first. It is a minor difference that reliably changes how a short message lands.',
        ],
      },
      {
        heading: 'Writing a good short note',
        body: [
          'The constraint of short writing is that there is nowhere to hide, and the failure mode is reaching for a phrase that could have been sent to anyone. "Thinking of you" is fine; "thinking about you sitting on the stairs putting your shoes on this morning" is a note only you could have written.',
          'One specific detail beats any amount of general warmth. If the note is an apology, name the thing rather than gesturing at it. If it is encouragement, name what they are walking into. Specificity is most of what makes short writing work.',
        ],
      },
      {
        heading: 'What actually happens to your note',
        body: [
          'The words are encoded into the link in your browser and never sent to us, which has two consequences worth knowing. Your note is not sitting in a database anywhere and cannot be read by us or handed to anyone else. It also cannot be edited or withdrawn after you send it, because there is no server-side copy to change — a new note means a new link.',
          'The practical read on privacy is that the link is the secret. It is never listed or indexed and will not surface in search, but anyone holding it can open the note, so it behaves like a sealed envelope left on a desk rather than a locked box. That is right for a surprise and wrong for anything genuinely sensitive; for that, a <a href="/write">letter with a password on it</a> is the tool you want.',
        ],
      },
      {
        heading: 'Where the note stops and a letter starts',
        body: [
          'A note is right when the message is one thing. Once you find yourself wanting to say a second unrelated thing, or to explain, or to cover something that has been sitting unsaid for a while, you have a letter — and compressing a letter into a note is how important things end up sounding casual.',
          'When it is a letter, <a href="/write">write it properly</a>. It is free, it needs no account on either side, and you can seal it behind a date if it should arrive on a particular day rather than now.',
        ],
      },
    ],
  },
]

export function getToolGuide(slug: string): ToolGuide | undefined {
  return TOOL_GUIDES.find(g => g.slug === slug)
}
