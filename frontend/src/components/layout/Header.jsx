import { NavLink } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <nav className="header">
      <div className="logo">IREG<span>-IT</span></div>
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/services">Services</NavLink></li>
        <li><NavLink to="/team">Team</NavLink></li>
        <li><NavLink to="/careers">Careers</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>
      <NavLink to="/contact" className="nav-cta">Get in Touch</NavLink>
    </nav>
  )
}