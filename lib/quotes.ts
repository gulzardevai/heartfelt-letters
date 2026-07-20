export interface Quote {
  id: string
  text: string
  author: string
  category: string
}

export const QUOTE_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'love', label: 'Love & Romance', emoji: '❤️' },
  { id: 'friendship', label: 'Friendship', emoji: '🤝' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'gratitude', label: 'Gratitude', emoji: '🙏' },
  { id: 'encouragement', label: 'Encouragement', emoji: '🌟' },
  { id: 'apology', label: 'Apology', emoji: '🕊️' },
  { id: 'missing', label: 'Missing Someone', emoji: '💭' },
  { id: 'grief', label: 'Loss & Grief', emoji: '🌸' },
  { id: 'celebration', label: 'Celebration', emoji: '🎉' },
  { id: 'inspiration', label: 'Inspiration', emoji: '🔥' },
]

export const QUOTES: Quote[] = [
  // Love & Romance
  { id: 'l1', text: 'You are every reason, every hope, and every dream I\'ve ever had.', author: 'Nicholas Sparks', category: 'love' },
  { id: 'l2', text: 'I have waited for this opportunity for more than half a century, to repeat to you once again my vow of eternal fidelity and everlasting love.', author: 'Gabriel García Márquez', category: 'love' },
  { id: 'l3', text: 'Whatever our souls are made of, his and mine are the same.', author: 'Emily Brontë', category: 'love' },
  { id: 'l4', text: 'I love you not only for what you are, but for what I am when I am with you.', author: 'Roy Croft', category: 'love' },
  { id: 'l5', text: 'In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.', author: 'Maya Angelou', category: 'love' },
  { id: 'l6', text: 'You know you\'re in love when you can\'t fall asleep because reality is finally better than your dreams.', author: 'Dr. Seuss', category: 'love' },
  { id: 'l7', text: 'To love and be loved is to feel the sun from both sides.', author: 'David Viscott', category: 'love' },
  { id: 'l8', text: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn', category: 'love' },
  { id: 'l9', text: 'I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.', author: 'Angelita Lim', category: 'love' },
  { id: 'l10', text: 'Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.', author: 'Lao Tzu', category: 'love' },

  // Friendship
  { id: 'f1', text: 'A real friend is one who walks in when the rest of the world walks out.', author: 'Walter Winchell', category: 'friendship' },
  { id: 'f2', text: 'Friendship is born at the moment when one person says to another: "What! You too? I thought I was the only one."', author: 'C.S. Lewis', category: 'friendship' },
  { id: 'f3', text: 'A friend is someone who knows all about you and still loves you.', author: 'Elbert Hubbard', category: 'friendship' },
  { id: 'f4', text: 'True friendship comes when the silence between two people is comfortable.', author: 'David Tyson', category: 'friendship' },
  { id: 'f5', text: 'Good friends are like stars. You don\'t always see them, but you know they\'re always there.', author: 'Unknown', category: 'friendship' },
  { id: 'f6', text: 'A friend is one who overlooks your broken fence and admires the flowers in your garden.', author: 'Unknown', category: 'friendship' },
  { id: 'f7', text: 'Friends are the siblings God never gave us.', author: 'Mencius', category: 'friendship' },
  { id: 'f8', text: 'No friendship is an accident.', author: 'O. Henry', category: 'friendship' },

  // Family
  { id: 'fam1', text: 'Family is not an important thing. It\'s everything.', author: 'Michael J. Fox', category: 'family' },
  { id: 'fam2', text: 'The love of family is life\'s greatest blessing.', author: 'Unknown', category: 'family' },
  { id: 'fam3', text: 'In family life, love is the oil that eases friction, the cement that binds closer together, and the music that brings harmony.', author: 'Friedrich Nietzsche', category: 'family' },
  { id: 'fam4', text: 'A happy family is but an earlier heaven.', author: 'George Bernard Shaw', category: 'family' },
  { id: 'fam5', text: 'Family means no one gets left behind or forgotten.', author: 'David Ogden Stiers', category: 'family' },
  { id: 'fam6', text: 'Other things may change us, but we start and end with family.', author: 'Anthony Brandt', category: 'family' },
  { id: 'fam7', text: 'The most important thing in the world is family and love.', author: 'John Wooden', category: 'family' },

  // Gratitude
  { id: 'g1', text: 'Gratitude makes sense of our past, brings peace for today, and creates a vision for tomorrow.', author: 'Melody Beattie', category: 'gratitude' },
  { id: 'g2', text: 'No duty is more urgent than giving thanks.', author: 'James Allen', category: 'gratitude' },
  { id: 'g3', text: 'At times, our own light goes out and is rekindled by a spark from another person. Each of us has cause to think with deep gratitude of those who have lighted the flame within us.', author: 'Albert Schweitzer', category: 'gratitude' },
  { id: 'g4', text: 'Feeling gratitude and not expressing it is like wrapping a present and not giving it.', author: 'William Arthur Ward', category: 'gratitude' },
  { id: 'g5', text: 'The roots of all goodness lie in the soil of appreciation for goodness.', author: 'Dalai Lama', category: 'gratitude' },
  { id: 'g6', text: 'I would maintain that thanks are the highest form of thought; and that gratitude is happiness doubled by wonder.', author: 'G.K. Chesterton', category: 'gratitude' },
  { id: 'g7', text: 'Silent gratitude isn\'t much use to anyone.', author: 'Gertrude Stein', category: 'gratitude' },

  // Encouragement
  { id: 'e1', text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', category: 'encouragement' },
  { id: 'e2', text: 'You are braver than you believe, stronger than you seem, and smarter than you think.', author: 'A.A. Milne', category: 'encouragement' },
  { id: 'e3', text: 'Keep your face always toward the sunshine, and shadows will fall behind you.', author: 'Walt Whitman', category: 'encouragement' },
  { id: 'e4', text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'encouragement' },
  { id: 'e5', text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius', category: 'encouragement' },
  { id: 'e6', text: 'Start where you are. Use what you have. Do what you can.', author: 'Arthur Ashe', category: 'encouragement' },
  { id: 'e7', text: 'You have within you right now, everything you need to deal with whatever the world can throw at you.', author: 'Brian Tracy', category: 'encouragement' },
  { id: 'e8', text: 'The secret of getting ahead is getting started.', author: 'Mark Twain', category: 'encouragement' },

  // Apology
  { id: 'a1', text: 'An apology is the superglue of life! It can repair just about anything.', author: 'Lynn Johnston', category: 'apology' },
  { id: 'a2', text: 'Sorry means you feel the pulse of other\'s pain as well as your own, and saying it means you take a share of it.', author: 'Jasmine Guinness', category: 'apology' },
  { id: 'a3', text: 'A genuine apology is like an antibiotic; a fake apology is like a sugar pill.', author: 'Randy Pausch', category: 'apology' },
  { id: 'a4', text: 'Apologizing does not always mean that you are wrong and the other person is right. It means that you value your relationship more than your ego.', author: 'Unknown', category: 'apology' },
  { id: 'a5', text: 'Never ruin an apology with an excuse.', author: 'Benjamin Franklin', category: 'apology' },
  { id: 'a6', text: 'The first to apologize is the bravest. The first to forgive is the strongest.', author: 'Unknown', category: 'apology' },

  // Missing Someone
  { id: 'm1', text: 'The scariest thing about distance is that you don\'t know whether they\'ll miss you or forget you.', author: 'Nicholas Sparks', category: 'missing' },
  { id: 'm2', text: 'If you think missing me is hard, you should try missing you.', author: 'Unknown', category: 'missing' },
  { id: 'm3', text: 'No matter where you go, you will always be in my heart.', author: 'Unknown', category: 'missing' },
  { id: 'm4', text: 'Distance means so little when someone means so much.', author: 'Tom McNeal', category: 'missing' },
  { id: 'm5', text: 'I carry your heart with me, I carry it in my heart.', author: 'E.E. Cummings', category: 'missing' },
  { id: 'm6', text: 'The pain of missing you is a beautiful reminder of the joy of loving you.', author: 'Dean Jackson', category: 'missing' },
  { id: 'm7', text: 'Absence sharpens love, presence strengthens it.', author: 'Thomas Fuller', category: 'missing' },

  // Loss & Grief
  { id: 'gr1', text: 'Grief is the price we pay for love.', author: 'Queen Elizabeth II', category: 'grief' },
  { id: 'gr2', text: 'Those we love don\'t go away, they walk beside us every day. Unseen, unheard, but always near, still loved, still missed, and very dear.', author: 'Unknown', category: 'grief' },
  { id: 'gr3', text: 'What we have once enjoyed we can never lose. All that we love deeply becomes a part of us.', author: 'Helen Keller', category: 'grief' },
  { id: 'gr4', text: 'To live in hearts we leave behind is not to die.', author: 'Thomas Campbell', category: 'grief' },
  { id: 'gr5', text: 'Unable are the loved to die. For love is immortality.', author: 'Emily Dickinson', category: 'grief' },
  { id: 'gr6', text: 'Grief is just love with no place to go.', author: 'Jamie Anderson', category: 'grief' },

  // Celebration
  { id: 'c1', text: 'Every day is a gift. That\'s why they call it the present.', author: 'Unknown', category: 'celebration' },
  { id: 'c2', text: 'Life is not measured by the number of breaths we take, but by the moments that take our breath away.', author: 'Maya Angelou', category: 'celebration' },
  { id: 'c3', text: 'Cheers to a new year and another chance for us to get it right.', author: 'Oprah Winfrey', category: 'celebration' },
  { id: 'c4', text: 'Let us celebrate the occasion with wine and sweet words.', author: 'Plautus', category: 'celebration' },
  { id: 'c5', text: 'Today is your day! Your mountain is waiting. So get on your way.', author: 'Dr. Seuss', category: 'celebration' },
  { id: 'c6', text: 'The more you praise and celebrate your life, the more there is in life to celebrate.', author: 'Oprah Winfrey', category: 'celebration' },

  // Inspiration
  { id: 'i1', text: 'The purpose of life is not to be happy. It is to be useful, to be honorable, to be compassionate, to have it make some difference that you have lived.', author: 'Ralph Waldo Emerson', category: 'inspiration' },
  { id: 'i2', text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein', category: 'inspiration' },
  { id: 'i3', text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle', category: 'inspiration' },
  { id: 'i4', text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon', category: 'inspiration' },
  { id: 'i5', text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.', author: 'Mother Teresa', category: 'inspiration' },
  { id: 'i6', text: 'When you reach the end of your rope, tie a knot in it and hang on.', author: 'Franklin D. Roosevelt', category: 'inspiration' },
  { id: 'i7', text: 'Don\'t judge each day by the harvest you reap but by the seeds that you plant.', author: 'Robert Louis Stevenson', category: 'inspiration' },
  { id: 'i8', text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins', category: 'inspiration' },
]
