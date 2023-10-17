import styles from "./index.module.css";
import Image, { StaticImageData } from "next/image";

interface Props {
  title: string;
  description: string[];
  image: StaticImageData;
  imageAlt: string;
}

export default function Section({
  title,
  description,
  image,
  imageAlt,
}: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.left}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <div className={styles.sectionContent}>
            {description.map((line, index) =>
              index === description.length - 1 ? (
                line
              ) : (
                <>
                  {line}
                  <br />
                </>
              ),
            )}
          </div>
        </div>
        <div className={styles.right}>
          <Image className={styles.eyeCatch} src={image} alt={imageAlt} />
        </div>
      </div>
    </section>
  );
}
