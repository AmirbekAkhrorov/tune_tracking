import React, { useState } from 'react'

const labelStyle = {
  display: 'block',
  marginBottom: '6px',
  fontSize: '11px',
  fontWeight: '700',
  color: 'rgba(56,189,248,0.45)',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
}

const inputStyle = {
  background: 'rgba(56,189,248,0.04)',
  border: '1px solid rgba(56,189,248,0.15)',
  color: '#F1F5F9',
  borderRadius: '10px',
  padding: '10px 13px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  width: '100%',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, background 0.2s',
}

export default function AddTaskModal({ task, projects, users, onSave, onClose }) {
  const initialTags = () => {
    if (!task?.tags) return ''
    try {
      const arr = typeof task.tags === 'string' ? JSON.parse(task.tags) : task.tags
      return Array.isArray(arr) ? arr.join(', ') : ''
    } catch { return '' }
  }

  const [form, setForm] = useState({
    title:       task?.title       || '',
    description: task?.description || '',
    status:      task?.status      || 'todo',
    priority:    task?.priority    || 'medium',
    project_id:  task?.project_id  || '',
    assigned_to: task?.assigned_to || '',
    due_date:    task?.due_date    || '',
    tags:        initialTags(),
  })

  function set(field, value) { setForm(f => ({ ...f, [field]: value })) }

  function handleSubmit(e) {
    e.preventDefault()
    const tagsArray = form.tags.split(',').map(t => t.trim()).filter(Boolean)
    onSave({
      ...form,
      project_id:  form.project_id  ? parseInt(form.project_id)  : null,
      assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
      tags: tagsArray,
    })
  }

  const focusIn  = e => { e.target.style.borderColor = 'rgba(56,189,248,0.5)'; e.target.style.background = 'rgba(56,189,248,0.07)' }
  const focusOut = e => { e.target.style.borderColor = 'rgba(56,189,248,0.15)'; e.target.style.background = 'rgba(56,189,248,0.04)' }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#0A1020', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(56,189,248,0.06)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '800', color: '#F1F5F9' }}>
              {task ? 'Редактировать задачу' : 'Создать задачу'}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>
              {task ? 'Измените параметры задачи' : 'Добавьте задачу на доску'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, lineHeight: '1' }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={labelStyle}>Название *</label>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                required
                placeholder="Что нужно сделать?"
                style={inputStyle}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>

            <div>
              <label style={labelStyle}>Описание</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Добавьте подробности..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                onFocus={focusIn}
                onBlur={focusOut}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Статус</label>
                <select value={form.status} onChange={e => set('status', e.target.value)} style={inputStyle}>
                  <option value="todo">К выполнению</option>
                  <option value="progress">В работе</option>
                  <option value="review">На проверке</option>
                  <option value="done">Выполнено</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Приоритет</label>
                <select value={form.priority} onChange={e => set('priority', e.target.value)} style={inputStyle}>
                  <option value="high">Высокий</option>
                  <option value="medium">Средний</option>
                  <option value="low">Низкий</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Проект</label>
                <select value={form.project_id} onChange={e => set('project_id', e.target.value)} style={inputStyle}>
                  <option value="">Без проекта</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Исполнитель</label>
                <select value={form.assigned_to} onChange={e => set('assigned_to', e.target.value)} style={inputStyle}>
                  <option value="">Не назначен</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.full_name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Срок сдачи</label>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={e => set('due_date', e.target.value)}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
              <div>
                <label style={labelStyle}>Теги (через запятую)</label>
                <input
                  value={form.tags}
                  onChange={e => set('tags', e.target.value)}
                  placeholder="React, API, UI"
                  style={inputStyle}
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.6)', borderRadius: '10px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '600', transition: 'all 0.2s' }}
            >
              Отмена
            </button>
            <button
              type="submit"
              style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg, #0EA5E9, #6366F1)', border: 'none', color: 'white', borderRadius: '10px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: '700', boxShadow: '0 4px 14px rgba(14,165,233,0.3)', letterSpacing: '0.2px' }}
            >
              {task ? 'Сохранить изменения' : 'Создать задачу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
