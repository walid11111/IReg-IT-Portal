import { useState } from 'react'
import { submitContact } from '../api/contact'
import Reveal from '../components/common/Reveal'
import './Contact.css'

export default function Contact() {
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoading(true)
    setError(null)
    try {
      await submitContact(form)
      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Reveal>
      <main className="contact section">
        <div className="section-label">Contact</div>
        <h2 className="section-title">Get In Touch</h2>
        <p className="contact-sub">Feel free to contact us with any questions or concerns. We appreciate
           your interest and look forward to hearing from you.</p>
      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-card">
            <h3>Reach our HR team directly</h3>
            <a href="mailto:careers.ireg@gmail.com" className="contact-email">careers.ireg@gmail.com</a>
          </div>
          <div className="contact-card">
            <h3>Address</h3>
            <span className="contact-address">Nasheman - e Iqbal Housing Society, Phase I, Near Wapda Town, Lahore.</span>
          </div>
          <div className="contact-card">
            <h3>For more details</h3>
            <a href="mailto:info.iregit@gmail.com" className="contact-email">info.iregit@gmail.com</a>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your name"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})}/>
            </div>
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea placeholder="Tell us about your project..."
              value={form.message} onChange={e => setForm({...form, message: e.target.value})}/>
          </div>
          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {success && <div className="form-success">✅ Message sent! We&apos;ll get back to you soon.</div>}
          {error && <div style={{color:'#ef4444', padding:'0.5rem'}}>{error}</div>}
        </form>
      </div>
      <div className="contact-map">
        <iframe
          title="IREG-IT Location"
          src="https://www.google.com/maps?q=Nasheman-e-Iqbal+Phase+1+Wapda+Town+Lahore&output=embed"
          loading="lazy"
        />
      </div>
      </main>
    </Reveal>
  )
}