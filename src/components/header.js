import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './header.module.css';

function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.navigation}>
        <NavLink 
          to="/" 
          exact 
          className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
        >
          Сөздік
        </NavLink>
        <NavLink 
          to="/profile"
          className={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
        >
          Профиль
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
