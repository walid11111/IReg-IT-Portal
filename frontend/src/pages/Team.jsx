import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTeamMembers } from '../api/team'
import Reveal from '../components/common/Reveal'
import './Team.css'

const CATEGORY_META = {
  frontend: { label: 'Frontend Engineer', color: '#06B6D4' },
  backend: { label: 'Backend Engineer', color: '#8B5CF6' },
  software: { label: 'Software Engineer', color: '#F59E0B' },
  ai: { label: 'AI Engineer', color: '#10B981' },
}

const LEAD_META = {
  overall: { label: 'Team Lead', star: true, color: '#F5B944' },
  frontend: { label: 'Frontend Team Lead', color: '#06B6D4' },
  backend: { label: 'Backend Team Lead', color: '#A78BFA' },
}

function SocialIcon({ platform, size = 16 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true }
  switch (platform) {
    case 'linkedin':
      return (
        <svg {...common}><path d="M4.98 3.5A2.49 2.49 0 1 1 0 3.5a2.49 2.49 0 0 1 4.98 0zM.2 8.1h4.6V24H.2zm7.9 0h4.4v2.2h.1c.6-1.1 2.1-2.3 4.3-2.3 4.6 0 5.4 3 5.4 6.9V24h-4.6v-7.3c0-1.7 0-4-2.4-4s-2.8 1.9-2.8 3.9V24H8.1z"/></svg>
      )
    case 'email':
      return (
        <svg {...common}><path d="M22 6l-10 7L2 6V4l10 7 10-7z" /><path d="M2 4h20v16H2z" /></svg>
      )
    case 'github':
      return (
        <svg {...common}><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.3c-3.34.73-4.04-1.4-4.04-1.4-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.9 1.24 3.22 0 4.6-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z"/></svg>
      )
    case 'x':
      return (
        <svg {...common}><path d="M18.9 1.2h3.68l-8.04 9.2L24 22.8h-7.4l-5.8-7.58-6.63 7.58H.5l8.6-9.82L0 1.2h7.58l5.24 6.93zm-1.29 19.4h2.04L6.49 3.24H4.3z"/></svg>
      )
    default:
      return (
        <svg {...common}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
      )
  }
}

function SocialLinks({ socials, name }) {
  if (!socials?.length) return null
  return (
    <div className="member-links">
      {socials.map(s => (
        <a
          key={s.id}
          href={s.value}
          target={s.platform === 'email' ? undefined : '_blank'}
          rel="noreferrer"
          className="member-social"
          aria-label={`${name} — ${s.label}`}
          onClick={e => e.stopPropagation()}
        >
          <SocialIcon platform={s.platform} />
        </a>
      ))}
    </div>
  )
}

function Avatar({ member }) {
  const colorMap = ['av1', 'av2', 'av3', 'av4', 'av5']
  const seed = member.id % colorMap.length
  if (member.photo) return <img src={member.photo} alt={member.name} loading="lazy" />
  return (
    <span className={`avatar-initials ${colorMap[seed]}`}>
      {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
    </span>
  )
}

function socialBio(member) {
  return member.bio.length > 120 ? `${member.bio.slice(0, 120)}…` : member.bio
}

function LeadBadge({ member }) {
  if (!member.leadership) return null
  const meta = LEAD_META[member.leadership]
  return (
    <span className={`lead-badge lead-badge--${member.leadership}`} style={{ color: meta.color, borderColor: meta.color }}>
      {meta.star ? '★ ' : ''}{meta.label}
    </span>
  )
}

function FeaturedCard({ member, main, expanded, onToggle }) {
  const color = CATEGORY_META[member.category]?.color
  return (
    <div
      className={`featured-person ${main ? 'featured-person--main' : ''} ${expanded ? 'expanded' : ''}`}
      role="button"
      aria-expanded={expanded}
      aria-label={`${member.name}, ${expanded ? 'collapse bio' : 'read full bio'}`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() } }}
    >
      <div className="featured-photo">
        <Avatar member={member} />
      </div>
      <div className="featured-info">
        <div className="featured-badges">
          <LeadBadge member={member} />
          <span className="featured-badge" style={{ color }}>{CATEGORY_META[member.category]?.label}</span>
        </div>
        <h3>{member.name}</h3>
        <div className="featured-role">{member.role}</div>
        <p className="featured-bio">{expanded ? member.bio : socialBio(member)}</p>
        <div className="featured-foot">
          <SocialLinks socials={member.socials} name={member.name} />
          <button type="button" className="featured-toggle" onClick={e => { e.stopPropagation(); onToggle() }}>
            {expanded ? 'Show less ▴' : member.bio.length > 120 ? 'Read full bio ▾' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}

function CompactCard({ member, flipped, onFlip }) {
  const color = CATEGORY_META[member.category]?.color
  return (
    <div
      className={`member-card ${flipped ? 'is-flipped' : ''}`}
      role="button"
      aria-expanded={flipped}
      aria-label={`${member.name}, ${flipped ? 'show less' : 'show more'}`}
      tabIndex={0}
      onClick={onFlip}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFlip() } }}
    >
      <div className="member-card-inner">
        <div className="member-face member-front">
          <div className="member-photo">
            <Avatar member={member} />
          </div>
          <h3>{member.name}</h3>
          <div className="member-role" style={{ color }}>{member.role}</div>
          {member.leadership && <span className="member-lead-badge"><LeadBadge member={member} /></span>}
          <span className="member-front-hint">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Click for more info
          </span>
        </div>
        <div className="member-face member-back">
          <h3>{member.name}</h3>
          <div className="member-role" style={{ color }}>{member.role}</div>
          {member.leadership && <LeadBadge member={member} />}
          <p>{member.bio}</p>
          <SocialLinks socials={member.socials} name={member.name} />
          <span className="member-flip-hint">Back to photo ↩</span>
        </div>
      </div>
    </div>
  )
}

export default function Team() {
  const [team, setTeam] = useState([])
  const [tab, setTab] = useState('all')
  const [flipped, setFlipped] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTeamMembers()
      .then(res => {
        setTeam(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load team.')
        setLoading(false)
      })
  }, [])

  if (loading) return <main className="team section"><p style={{ color: 'var(--slate-light)' }}>Loading...</p></main>
  if (error) return <main className="team section"><p style={{ color: '#ef4444' }}>{error}</p></main>

  const categories = [...new Set(team.map(m => m.category))]
  const categoryCounts = categories.map(c => ({ value: c, count: team.filter(m => m.category === c).length }))

  const leads = team.filter(m => m.leadership)
  const leadOrder = ['frontend', 'overall', 'backend']
  const top = leadOrder.map(r => leads.find(m => m.leadership === r)).filter(Boolean)

  const members = team.filter(m => {
    const inTab = tab === 'all' || m.category === tab
    return inTab && !top.some(x => x.id === m.id)
  })

  return (
    <Reveal>
      <main className="team section">
        <div className="section-label">Our People</div>
        <h2 className="section-title">The Team</h2>
        <p className="team-sub">
          {team.length} engineers building automation that runs businesses — from multi-tenant SaaS backends to polished product frontends.
          {categoryCounts.length > 0 && (
            <span className="team-counts">
              {categoryCounts.map(c => (
                <span key={c.value} className="team-count">
                  {c.count} {CATEGORY_META[c.value]?.label}
                </span>
              ))}
            </span>
          )}
        </p>

        {categories.length > 0 && (
          <div className="team-tabs">
            <button className={tab === 'all' ? 'team-tab-btn team-tab-active' : 'team-tab-btn'} onClick={() => setTab('all')}>All</button>
            {categories.map(c => (
              <button
                key={c}
                className={tab === c ? 'team-tab-btn team-tab-active' : 'team-tab-btn'}
                onClick={() => setTab(c)}
              >
                {CATEGORY_META[c]?.label || c}
              </button>
            ))}
          </div>
        )}

        {top.length > 0 && (
          <div className="lead-row">
            {top.map(m => (
              <FeaturedCard
                key={m.id}
                member={m}
                main={m.leadership === 'overall'}
                expanded={expanded === m.id}
                onToggle={() => setExpanded(expanded === m.id ? null : m.id)}
              />
            ))}
          </div>
        )}

        <div className="member-grid">
          {members.map(m => (
            <CompactCard key={m.id} member={m} flipped={flipped === m.id} onFlip={() => setFlipped(flipped === m.id ? null : m.id)} />
          ))}
        </div>

        <div className="team-cta">
          <div>
            <h3>Like what you see?</h3>
            <p>We're growing — join a team that ships real SaaS products.</p>
          </div>
          <Link to="/careers" className="btn-primary btn-cta">See open roles</Link>
        </div>
      </main>
    </Reveal>
  )
}