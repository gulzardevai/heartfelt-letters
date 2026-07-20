import { Template } from '@/lib/templates'

interface Props {
  template: Template
  selected: boolean
  onClick: () => void
}

export default function TemplateCard({ template, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 text-left transition-all hover:shadow-md w-full ${
        selected
          ? 'border-rose-500 bg-rose-50 shadow-md shadow-rose-100'
          : 'border-rose-100 bg-white hover:border-rose-300 hover:bg-rose-50/50'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-serif font-semibold text-rose-900">{template.name}</h3>
        {selected && <span className="text-rose-500 text-sm flex-shrink-0">✓</span>}
      </div>
      <p className="text-sm text-rose-700/60 leading-relaxed italic">{template.preview}</p>
    </button>
  )
}
