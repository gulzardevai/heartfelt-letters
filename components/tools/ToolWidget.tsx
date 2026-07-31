'use client'
import LoveCalculator from './LoveCalculator'
import DaysTogether from './DaysTogether'
import NicknameGenerator from './NicknameGenerator'
import LoveLanguageQuiz from './LoveLanguageQuiz'
import AnniversaryGifts from './AnniversaryGifts'
import Countdown from './Countdown'
import ZodiacCompatibility from './ZodiacCompatibility'
import CouplesQuestions from './CouplesQuestions'

export default function ToolWidget({ slug }: { slug: string }) {
  switch (slug) {
    case 'love-calculator':
      return <LoveCalculator />
    case 'days-together':
      return <DaysTogether />
    case 'nickname-generator':
      return <NicknameGenerator />
    case 'love-language-quiz':
      return <LoveLanguageQuiz />
    case 'anniversary-gifts':
      return <AnniversaryGifts />
    case 'countdown':
      return <Countdown />
    case 'zodiac-compatibility':
      return <ZodiacCompatibility />
    case 'couples-questions':
      return <CouplesQuestions />
    default:
      return null
  }
}
