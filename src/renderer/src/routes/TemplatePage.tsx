import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Template } from '@renderer/features/template'
import { useAppStore } from '@renderer/store/appStore'

/** `/weekly-template` — the Weekly Template editor. */
export function TemplatePage(): ReactNode {
  const navigate = useNavigate()
  const template = useAppStore((s) => s.template)
  const addTemplateEntry = useAppStore((s) => s.addTemplateEntry)
  const removeTemplateEntry = useAppStore((s) => s.removeTemplateEntry)
  const moveTemplateEntry = useAppStore((s) => s.moveTemplateEntry)
  const applyTemplate = useAppStore((s) => s.applyTemplate)

  return (
    <Template
      template={template}
      onAddEntry={addTemplateEntry}
      onRemoveEntry={removeTemplateEntry}
      onMoveEntry={moveTemplateEntry}
      onApply={(tmpl, startISO, endISO) => {
        applyTemplate(tmpl, startISO, endISO)
        // Applying writes onto the calendar — jump there so the result is visible.
        navigate('/calendar')
      }}
    />
  )
}
