import Link from "next/link";

import styles from "./styles/not-found.module.css"
import { NotFoundCat } from "./shared/icons/components/not-found";

import { useTranslate } from "./shared/libs/i18n";

export default function NotFound() {
  const t = useTranslate()

  return (
    <div className={styles.container}>
      <NotFoundCat />
      <div className={styles.content}>
        <div className={styles.left}>
          <p className={styles.errorStatus}>404</p>
        </div>
        <div className={styles.right}>
          <p className={styles.title}>{t("notFound.sorry")}</p>
          <p className={styles.subtitle}>{t("notFound.title")}</p>
          <Link className={styles.button} href="/">
            {t("notFound.button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
