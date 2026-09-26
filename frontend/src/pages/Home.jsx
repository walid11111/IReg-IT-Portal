import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTechnologies } from '../api/technologies'
import Reveal from '../components/common/Reveal'
import macbookImg from '../assets/macbook-code.jpg'
import codeScreenImg from '../assets/code-screen.jpg'
import teamMeetingImg from '../assets/team-meeting.jpg'
import './Home.css'

export default function Home() {
  const [technologies, setTechnologies] = useState([])

  useEffect(() => {
    getTechnologies()
      .then(res => setTechnologies(res.data))
      .catch(() => setTechnologies([]))
  }, [])

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">Code &amp; No-Code Solutions</div>
          <h1>Creating <em>Innovative</em> Solutions</h1>
          <p>Programming &amp; no-code software for every business — built by a team that
             understands your unique needs.</p>
          <div className="hero-btns">
            <Link to="/services" className="btn-primary">Explore Services</Link>
            <Link to="/contact" className="btn-outline">Talk to Us</Link>
          </div>
        </div>
      </section>

      <Reveal>
        <section className="home-intro">
          <div className="intro-text">
            <div className="section-label">Who We Are</div>
            <h3>We Understand That Every Business Is Different!</h3>
            <p>We provide custom solutions to our clients by using both code and no-code platforms.
               Our team of skilled developers and experts work tirelessly to ensure that every client's
               unique needs are met. So we take a tailored approach when developing solutions. Our clients
               can trust us to deliver the exact solutions they need. We believe in staying up-to-date with
               the latest industry trends and incorporating them into our work. Our goal is to provide our
               clients with the best possible solutions, no matter what their requirements may be.</p>
          </div>
          <div className="intro-media">
            <img src={macbookImg}
                 alt="MacBook Pro showing programming language"
                 className="intro-img" loading="lazy" />
          </div>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className="home-tech">
          <div className="tech-copy">
            <div className="section-label">What We Work With</div>
            <h3>Technologies</h3>
            <p className="tech-sub">Our services revolve around website development. We provide the tools
               and knowledge needed to help you succeed.</p>
            <ul className="tech-list">
              {technologies.map(t => <li key={t.id}>{t.name}</li>)}
            </ul>
          </div>
          <div className="tech-media">
            <img src={codeScreenImg}
                 alt="Code editor showing programming language"
                 className="tech-img" loading="lazy" />
          </div>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className="home-comm">
          <div className="comm-media">
            <img src={teamMeetingImg}
                 alt="Team collaborating on a project"
                 className="comm-img" loading="lazy" />
          </div>
          <div className="comm-copy">
            <div className="section-label">And let&apos;s not forget</div>
            <h3>Clear Communication</h3>
            <p>Effective communication between clients and developers is crucial for achieving the desired
               outcome of any project. At our company, we understand the importance of clear and strong
               communication and strive to provide just that.</p>
            <p>Our team of professionals works closely with clients to ensure that their requirements are
               understood and their vision is brought to life. We believe that regular communication is the
               key to success, which is why we keep our clients in the loop throughout the development
               process.</p>
            <p className="comm-highlight">This approach not only helps us to meet deadlines but also ensures
               that our clients are satisfied with the end result. By maintaining a strong relationship with
               our clients, we build long-lasting partnerships and deliver exceptional results.</p>
          </div>
        </section>
      </Reveal>
    </main>
  )
}