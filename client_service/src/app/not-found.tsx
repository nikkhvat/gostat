import Link from "next/link";

import styles from "./styles/not-found.module.css"
import { NotFoundCat } from "./shared/icons/components/not-found";

export default function NotFound() {
  return (
    <div className={styles.container}>
      <NotFoundCat />
      <div className={styles.content}>
        <div className={styles.left}>
          <p className={styles.errorStatus}>404</p>
        </div>
        <div className={styles.right}>
          <p className={styles.title}>Sorry!</p>
          <p className={styles.subtitle}>This page could not be found.</p>
          <Link className={styles.button} href="/">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}
