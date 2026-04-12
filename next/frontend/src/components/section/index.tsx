import styles from "./index.module.scss";
import Image, { StaticImageData } from "next/image";

interface Element {
  description: string[];
  image: StaticImageData;
  alt: string;
}

interface Props {
  title: string;
  elements: Element[];
}

export default function Section({ title, elements }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <div className={styles.group}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <div className={styles.body}>
            {elements.map((ele, index) => {
              return (
                <div className={styles.segment} key={index}>
                  <div className={styles.left}>
                    <div className={styles.description}>
                      {ele.description.map((line) => {
                        return (
                          <p className={styles.descriptionText} key={line}>
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                  <div className={styles.right}>
                    <Image
                      className={styles.image}
                      src={ele.image}
                      alt={ele.alt}
                      fill
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
