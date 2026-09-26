import { useEffect, useState } from 'react'
import { getJobs } from '../api/jobs'
import Reveal from '../components/common/Reveal'
import './Careers.css'

export default function Careers() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    getJobs()
      .then(res => setJobs(res.data))
      .catch(() => setJobs([]))
  }, [])

  const featured = jobs.find(j => j.is_featured)
  const regular = jobs.filter(j => !j.is_featured)

  return (
    <Reveal>
      <main className="careers section">
        <div className="section-label">Join Us</div>
        <h2 className="section-title">Careers - Hiring / Internship Opportunities</h2>
        <p className="careers-sub">We&apos;re always looking for passionate talent. Pick a role below and
           hit the button to apply — each one opens our application form.</p>

        {featured && (
          <section className="career-highlight">
            <h3>{featured.title}</h3>
            <p>Gain hands-on experience with international teams and global web development trends.</p>
            <div className="career-btns">
              <a href={featured.apply_link} target="_blank" rel="noopener noreferrer" className="btn-primary">Apply Now</a>
              <a href="https://www.top-interns.com/" target="_blank" rel="noopener noreferrer" className="btn-outline">Learn More</a>
            </div>
          </section>
        )}

        <div className="careers-grid">
          {regular.map(job => (
            <div className="career-card" key={job.id}>
              <h4>{job.title}</h4>
              <a href={job.apply_link} target="_blank" rel="noopener noreferrer" className="career-apply">Apply for</a>
            </div>
          ))}
        </div>
      </main>
    </Reveal>
  )
}