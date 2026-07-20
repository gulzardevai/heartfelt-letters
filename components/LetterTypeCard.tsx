import { LetterType } from '@/lib/templates'

interface Props {
  type: LetterType
  selected: boolean
  onClick: () => void
}

export default function LetterTypeCard({ type, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 transition-all text-center hover:-translate-y-1 hover:shadow-md w-full ${
        selected
          ? 'border-rose-500 bg-rose-50 shadow-md shadow-rose-100'
          : `border-transparent ${type.bgColor} hover:border-rose-300`
      }`}
    >
      <div className="text-3xl mb-2">{type.emoji}</div>
      <div className={`text-sm font-semibold ${selected ? 'text-rose-700' : type.color}`}>
        {type.label}
      </div>
      {selected && <div className="mt-1 text-rose-500 text-xs">✓ Selected</div>}
    </button>
  )
}
