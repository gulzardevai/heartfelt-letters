'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Underline from '@tiptap/extension-underline'
import { useCallback, useRef } from 'react'
import type { Editor as TiptapEditor } from '@tiptap/react'

interface Props {
  content: string
  onChange: (html: string) => void
}

const FONTS = ['Playfair Display', 'Georgia', 'Dancing Script', 'Inter', 'Arial', 'Times New Roman']
const COLORS = ['#2c1810', '#9f1239', '#1e3a5f', '#14532d', '#7c3aed', '#92400e', '#0f766e', '#374151']

// Defined outside component so React never unmounts/remounts it
function ToolBtn({
  onMouseDown,
  active,
  title,
  children,
}: {
  onMouseDown: (e: React.MouseEvent) => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={onMouseDown}
      className={`px-2 py-1.5 rounded-lg text-sm transition-all select-none ${
        active ? 'bg-rose-100 text-rose-700' : 'hover:bg-rose-50 text-rose-800/70 hover:text-rose-700'
      }`}
    >
      {children}
    </button>
  )
}

// Prevent editor blur on every toolbar interaction
function prevent(e: React.MouseEvent) {
  e.preventDefault()
}

export default function Editor({ content, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Image.configure({ inline: false, allowBase64: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: { class: 'prose-editor' },
    },
  })

  const addImage = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      editor?.chain().focus().setImage({ src: e.target?.result as string }).run()
    }
    reader.readAsDataURL(file)
  }, [editor])

  if (!editor) return null

  const cmd = (fn: (e: TiptapEditor) => void) => (ev: React.MouseEvent) => {
    ev.preventDefault()
    fn(editor)
  }

  return (
    <div className="border border-rose-100 rounded-2xl overflow-hidden bg-white shadow-paper">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 border-b border-rose-100 bg-rose-50/50">

        <ToolBtn onMouseDown={cmd(e => e.chain().focus().toggleBold().run())} active={editor.isActive('bold')} title="Bold">
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn onMouseDown={cmd(e => e.chain().focus().toggleItalic().run())} active={editor.isActive('italic')} title="Italic">
          <em>I</em>
        </ToolBtn>
        <ToolBtn onMouseDown={cmd(e => e.chain().focus().toggleUnderline().run())} active={editor.isActive('underline')} title="Underline">
          <u>U</u>
        </ToolBtn>

        <div className="w-px bg-rose-200 mx-1" />

        <ToolBtn onMouseDown={cmd(e => e.chain().focus().setTextAlign('left').run())} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
          ▤
        </ToolBtn>
        <ToolBtn onMouseDown={cmd(e => e.chain().focus().setTextAlign('center').run())} active={editor.isActive({ textAlign: 'center' })} title="Center">
          ▥
        </ToolBtn>
        <ToolBtn onMouseDown={cmd(e => e.chain().focus().setTextAlign('right').run())} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
          ▦
        </ToolBtn>

        <div className="w-px bg-rose-200 mx-1" />

        <ToolBtn onMouseDown={cmd(e => e.chain().focus().toggleBlockquote().run())} active={editor.isActive('blockquote')} title="Blockquote">
          ❝
        </ToolBtn>
        <ToolBtn onMouseDown={cmd(e => e.chain().focus().toggleBulletList().run())} active={editor.isActive('bulletList')} title="Bullet List">
          •≡
        </ToolBtn>

        <div className="w-px bg-rose-200 mx-1" />

        {/* Font selector */}
        <select
          onChange={(e) => {
            editor.chain().focus().setFontFamily(e.target.value).run()
          }}
          value={editor.getAttributes('textStyle').fontFamily || ''}
          className="text-xs border border-rose-200 rounded-lg px-2 py-1 bg-white text-rose-800 focus:outline-none focus:ring-1 focus:ring-rose-300"
        >
          <option value="" disabled>Font</option>
          {FONTS.map(f => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
        </select>

        {/* Color picker */}
        <div className="flex items-center gap-1 ml-1">
          {COLORS.map(color => (
            <button
              key={color}
              type="button"
              title={color}
              onMouseDown={(e) => {
                e.preventDefault()
                editor.chain().focus().setColor(color).run()
              }}
              className="w-5 h-5 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <div className="w-px bg-rose-200 mx-1" />

        {/* Image upload */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) addImage(e.target.files[0]) }}
        />
        <ToolBtn
          onMouseDown={(e) => { e.preventDefault(); fileRef.current?.click() }}
          title="Add Image"
        >
          🖼️
        </ToolBtn>
      </div>

      {/* Editor area — scrolls internally so the toolbar stays visible */}
      <div className="tiptap-editor letter-paper-plain p-6 min-h-[400px] max-h-[65vh] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
