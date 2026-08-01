import { notFound } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import AdminQuizEditor from '@/components/AdminQuizEditor'
import type { AdminQuiz } from '@/lib/admin-quizzes'

export const dynamic = 'force-dynamic'

export default async function EditQuizPage({ params }: { params: { id: string } }) {
  const db = getSupabaseAdmin()
  const { data: quiz } = await db.from('admin_quizzes').select('*').eq('id', params.id).single()

  if (!quiz) notFound()

  return <AdminQuizEditor initial={quiz as AdminQuiz} />
}
