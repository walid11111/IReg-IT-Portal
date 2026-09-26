import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">IREG<span>-IT</span></div>
          <p>Information Research and Expert Guide - IT</p>
        </div>
        <div className="footer-follow">
          <p>Follow us</p>
          <div className="footer-socials">
            <a href="https://www.linkedin.com/company/ireg-it/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z"/></svg>
            </a>
            <a href="mailto:careers.ireg@gmail.com" aria-label="Mail">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.24-8 5-8-5V6h16v2.24z"/></svg>
            </a>
            <a href="https://www.facebook.com/groups/1242353146521153/?ref=share" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z"/></svg>
            </a>
          </div>
        </div>
        <div className="footer-contact">
          <div className="footer-col">
            <p className="footer-label">For more details,</p>
            <p className="footer-value">support@marys-team.com</p>
          </div>
          <div className="footer-col">
            <p className="footer-label">Reach our HR Team</p>
            <a className="footer-value" href="mailto:careers.ireg@gmail.com">careers.ireg@gmail.com</a>
          </div>
        </div>
      </div>
      <div className="footer-address">
        Nasheman e Iqbal Housing Society, Phase I, Near Wapda Town, Lahore.
      </div>
      <div className="footer-bottom">
        <p>© 2026 IREG-IT. All rights reserved. Built with Django + React.</p>
      </div>
    </footer>
  )
}