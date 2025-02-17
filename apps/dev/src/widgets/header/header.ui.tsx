import React from "react";
import { Link } from "gatsby";

import * as style from "./header.ui.css";

function Header() {
  return (
    <header className={style.headerRoot}>
      <div className={style.headerContainer}>
        <Link to="/">
          <img
            src="/images/logo.png"
            alt="dev.kyoungah.me"
            className={style.headerLogo}
          />
        </Link>
        <nav>
          <ul className={style.headerNavList}>
            <li className={style.headerNavItem}>
              <Link to="/tags" className={style.headerNavItemLink}>
                <img
                  src="/svgs/tag.svg"
                  alt="Tags"
                  aria-hidden="true"
                  className={style.headerNavItemLinkImage}
                />
                <span className={style.headerNavItemLinkText}>Tags</span>
              </Link>
            </li>
            <li className={style.headerNavItem}>
              <Link to="/about" className={style.headerNavItemLink}>
                <img
                  src="/svgs/person.svg"
                  alt="About"
                  aria-hidden="true"
                  className={style.headerNavItemLinkImage}
                />
                <span className={style.headerNavItemLinkText}>About</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export { Header };
