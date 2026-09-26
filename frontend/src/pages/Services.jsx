import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getServices } from '../api/services'
import Reveal from '../components/common/Reveal'
import codeScreenImg from '../assets/code-screen.jpg'
import macbookImg from '../assets/macbook-code.jpg'
import teamMeetingImg from '../assets/team-meeting.jpg'
import './Services.css'

const CATEGORY_META = {
  communication: { label: 'Communication & Marketing', color: '#06B6D4' },
  documents: { label: 'Documents & eSignature', color: '#8B5CF6' },
  ai: { label: 'AI & Smart Automation', color: '#F59E0B' },
  contacts: { label: 'Contacts & Engagement', color: '#10B981' },
  general: { label: 'General', color: '#3B82F6' },
}

const FEATURE_IMAGES = {
  ai: codeScreenImg,
  documents: macbookImg,
  communication: teamMeetingImg,
  contacts: teamMeetingImg,
}

function Icon({ category, size = 22 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }
  switch (category) {
    case 'communication':
      return (
        <svg {...common}><path d="M3 11l18-7-3 14-6-7-9 0z" /><path d="M12 18v5" /></svg>
      )
    case 'documents':
      return (
        <svg {...common}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M12 18v-6" /><path d="M9 15l3 3 3-3" /></svg>
      )
    case 'ai':
      return (
        <svg {...common}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 15l.9 2.4L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.6z" /><path d="M5 3l.7 1.8L7.5 5.5 5.7 6.2 5 8l-.7-1.8L2.5 5.5l1.8-.7z" /></svg>
      )
    case 'contacts':
      return (
        <svg {...common}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      )
    default:
      return (
        <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
      )
  }
}

export default function Services() {
  const [services, setServices] = useState([])
  const [tab, setTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getServices()
      .then(res => {
        setServices(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load services.')
        setLoading(false)
      })
  }, [])

  if (loading) return <main className="services section"><p style={{ color: 'var(--slate-light)' }}>Loading...</p></main>
  if (error) return <main className="services section"><p style={{ color: '#ef4444' }}>{error}</p></main>

  const categories = [...new Set(services.map(s => s.category))]
  const featured = services.filter(s => s.is_featured).slice(0, 3)
  const gridServices = services.filter(s => {
    const inTab = tab === 'all' || s.category === tab
    return inTab && !s.is_featured
  })

  return (
    <Reveal>
      <main className="services section">
        <div className="section-label">What We Do</div>
        <h2 className="section-title">Services</h2>
        <p className="section-sub">Automation, AI, and all-in-one business tools — built to help teams work smarter, faster, and grow.</p>

        {featured.length > 0 && (
          <div className="featured-blocks">
            {featured.map((s, i) => {
              const img = FEATURE_IMAGES[s.category] || FEATURE_IMAGES.general
              return (
                <div className={`featured-block ${i % 2 === 1 ? 'featured-reverse' : ''}`} key={s.id}>
                  <div className="featured-media">
                    <img src={img} alt={s.title} loading="lazy" />
                  </div>
                  <div className="featured-body">
                    <div className="featured-icon" style={{ color: CATEGORY_META[s.category]?.color }}>
                      <Icon category={s.category} size={26} />
                    </div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                    {s.features?.length > 0 && (
                      <ul className="featured-list">
                        {s.features.slice(0, 4).map(f => <li key={f.id}>{f.name}</li>)}
                      </ul>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {categories.length > 0 && (
          <div className="services-tabs">
            <button className={tab === 'all' ? 'tab-btn tab-active' : 'tab-btn'} onClick={() => setTab('all')}>All</button>
            {categories.map(c => (
              <button
                key={c}
                className={tab === c ? 'tab-btn tab-active' : 'tab-btn'}
                onClick={() => setTab(c)}
              >
                {CATEGORY_META[c]?.label || c}
              </button>
            ))}
          </div>
        )}

        <div className="services-grid">
          {gridServices.map(s => (
            <div className="service-card" key={s.id}>
              <div className="service-icon" style={{ color: CATEGORY_META[s.category]?.color }}>
                <Icon category={s.category} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              {s.features?.length > 0 && (
                <div className="service-chips">
                  {s.features.slice(0, 5).map(f => <span className="service-chip" key={f.id}>{f.name}</span>)}
                </div>
              )}
              <span className="service-more">Learn more →</span>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <h3>Want to see it in action?</h3>
          <p>Schedule a free walkthrough and we'll show you how these tools fit your workflow.</p>
          <Link to="/contact" className="btn-primary btn-cta">Contact us</Link>
        </div>

        <div className="trust-row">
          <div><strong>5+</strong><span>Years Combined Experience</span></div>
          <div><strong>11</strong><span>Automation Products</span></div>
          <div><strong>24/7</strong><span>Client Support</span></div>
        </div>
      </main>
    </Reveal>
  )
}