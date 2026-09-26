import Reveal from '../components/common/Reveal'
import ceoImg from '../assets/ceo.png'
import './About.css'

const journey = [
  {
    title: 'A Vision Takes Flight',
    text: 'In 2022, our startup embarked on an exciting journey with a small team consisting of one non-tech person who believed in the power of web development to transform lives. Driven by a shared vision, we set out to create opportunities for young talent in Pakistan by offering code and no-code web development training.',
  },
  {
    title: 'Expanding Horizons: First Steps in Web Development',
    text: 'As our team grew, we took our first steps in the web development world. With a team of engineering graduates joining us, we embarked on our initial project using Bubble.io, a powerful no-code development platform. This experience laid the foundation for our startup, as we witnessed the potential of no-code development to empower individuals to bring their ideas to life without extensive coding knowledge.',
  },
  {
    title: 'Diversifying Skills: Embracing Interns',
    text: 'Driven by a passion for continuous growth and innovation, we expanded our repertoire of web development tools and technologies. Our next project led us to embrace Drupal, a popular content management system. We leveraged the expertise of programming interns, providing them with hands-on experience and the opportunity to contribute to real-world projects. This phase marked an important milestone in our journey, as we recognized the importance of equipping young talent with diverse skills and empowering them to excel in the ever-evolving web development landscape.',
  },
]

const current = [
  {
    title: 'Current Endeavor: High Demand Tech Bootcamp and International Internships',
    text: 'Building upon our previous successes, we are now excited to introduce our latest venture: a high-demand tech bootcamp. Recognizing the growing demand for technical expertise, we have curated a comprehensive curriculum that covers the latest technologies, programming languages, and frameworks. Our bootcamp not only equips participants with the skills they need to excel but also connects them to international internship opportunities, providing invaluable exposure to global web development trends and experiences.',
  },
  {
    title: 'Looking Ahead: Paving the Way for Pakistan\u2019s Tech Leaders',
    text: 'As we continue to grow and evolve, our startup remains committed to nurturing and unleashing the potential of young talent in Pakistan. We are dedicated to providing the resources, training, and opportunities necessary to empower aspiring developers and bridge the gap between talent and industry demands. Our vision is to cultivate a generation of web development leaders who drive innovation, transform businesses, and contribute to the growth of Pakistan\u2019s tech ecosystem.',
  },
]

export default function About() {
  return (
    <main className="about">
      <section className="about-hero">
        <div className="about-hero-bg"></div>
        <div className="about-hero-content">
          <div className="section-label">Get To Know Us</div>
          <h1>About <em>IREG-IT</em></h1>
          <p>Efficient and Cost-Effective Software Solutions — building the next generation
             of Pakistan&apos;s tech leaders.</p>
        </div>
      </section>

      <Reveal>
        <section className="about-ceo">
          <div className="about-ceo-media">
            <img src={ceoImg} alt="Ahmad Malik, CEO of IREG-IT" className="about-ceo-img" loading="lazy" />
          </div>
          <div className="about-ceo-text">
            <div className="section-label">Leadership</div>
            <h3>Ahmad Malik, CEO</h3>
            <p>He is a talented individual with a broad range of interests and skills. Ahmad is a tax
               professional in the USA and possesses an entrepreneurial spirit. However, he is not just
               limited to this field alone. He has proven himself to be successful in the field of IT.</p>
            <p>He has always dreamed of establishing a tech company in Pakistan that creates better financial
               and quality opportunities for the young talent. With his skills and experience, Ahmad is
               confident that he can make his vision a reality and help shape the future of the tech industry
               in Pakistan.</p>
          </div>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className="about-block">
          <div className="block-head">
            <div className="section-label">Our Path</div>
            <h2>Our Journey</h2>
          </div>
          <div className="timeline">
            {journey.map((item, i) => (
              <article key={item.title} className="about-timeline">
                <div className="timeline-dot">{i + 1}</div>
                <div className="timeline-body">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className="about-block">
          <div className="block-head">
            <div className="section-label">Where We Are</div>
            <h2>Current Endeavor</h2>
          </div>
          <div className="timeline">
            {current.map((item, i) => (
              <article key={item.title} className="about-timeline">
                <div className="timeline-dot">{journey.length + i + 1}</div>
                <div className="timeline-body">
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={100}>
        <section className="about-message">
          <div className="section-label">From The Top</div>
          <h3>Message from the CEO!</h3>
          <p>As the CEO of this company, I extend a warm welcome to both aspiring young talents and
             businesses seeking innovative solutions. Our mission is to inspire and empower the next
             generation of IT leaders while delivering cutting-edge technology to drive business success.</p>
          <p>For young talents, we provide a nurturing environment that encourages creativity, continuous
             learning, and collaboration. Our diverse team of experts is dedicated to supporting and
             mentoring you as you embark on your journey in the IT world. Dream big, embrace challenges,
             and let your brilliance shine!</p>
          <p>To businesses, we offer customized software solutions that address your unique needs, while
             delivering a seamless user experience. Our team of skilled professionals combines technical
             expertise with a deep understanding of diverse industries. Together, we will drive growth,
             efficiency, and customer satisfaction.</p>
          <p>Collaboration and transparency are at the heart of our approach. We value open communication
             and forge strong relationships with our clients. Your success is our success, and we are
             committed to providing unwavering support throughout the project lifecycle and beyond.</p>
          <p>Thank you for choosing us as your partner on this incredible journey. Let&apos;s redefine the
             boundaries of what is possible in the world of technology and create a future filled with
             innovation and business excellence.</p>
          <p className="message-sign">Warm regards.</p>
        </section>
      </Reveal>
    </main>
  )
}