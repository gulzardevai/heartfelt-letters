'use client'
import LoveCalculator from './LoveCalculator'
import DaysTogether from './DaysTogether'
import NicknameGenerator from './NicknameGenerator'
import LoveLanguageQuiz from './LoveLanguageQuiz'
import AnniversaryGifts from './AnniversaryGifts'
import Countdown from './Countdown'
import ZodiacCompatibility from './ZodiacCompatibility'
import CouplesQuestions from './CouplesQuestions'
import LoveNote from './LoveNote'

// `initial` is the decoded result state from a /tools/<slug>/r/<data> permalink,
// or null on the plain (indexable) tool page.
export default function ToolWidget({ slug, initial = null }: { slug: string; initial?: any }) {
  switch (slug) {
    case 'love-calculator':
      return <LoveCalculator initial={initial} />
    case 'days-together':
      return <DaysTogether initial={initial} />
    case 'nickname-generator':
      return <NicknameGenerator initial={initial} />
    case 'love-language-quiz':
      return <LoveLanguageQuiz initial={initial} />
    case 'anniversary-gifts':
      return <AnniversaryGifts initial={initial} />
    case 'countdown':
      return <Countdown initial={initial} />
    case 'zodiac-compatibility':
      return <ZodiacCompatibility initial={initial} />
    case 'couples-questions':
      return <CouplesQuestions initial={initial} />
    case 'love-note':
      return <LoveNote initial={initial} />
    default:
      return null
  }
}
