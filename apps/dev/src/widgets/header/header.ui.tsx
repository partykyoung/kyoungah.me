import React from "react";
import { Link } from "gatsby";

import { headerRoot, headerLogo } from "./header.ui.css";

function Header() {
  return (
    <header className={headerRoot}>
      <div className="container">
        <Link to="/">
          <img
            src="/images/logo.png"
            alt="dev.kyoungah.me"
            className={headerLogo}
          />
        </Link>
      </div>
      {/* <nav className={headerNavigation}>
        <ul className={headerNavigationList}>
          <li className={headerNavigationItem}>
            <Link to="/tags">
              <span
                aria-label="tags"
                className={clsx(headerNavigationItemLink, tags)}
              />
            </Link>
          </li>
          <li className={headerNavigationItem}>
            <a href="/about" rel="noopener" target="_blank">
              <span
                aria-label="about"
                className={clsx(headerNavigationItemLink, about)}
              />
            </a>
          </li>
        </ul>
      </nav> */}
    </header>
  );
}

export { Header };
