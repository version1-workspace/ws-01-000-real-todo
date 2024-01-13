import styles from "./page.module.css";
import Header from "@/components/common/header/public";
import Footer from "@/components/common/footer";
import Button from "@/components/common/button";
import Section from "@/components/section";
import img1 from "@/assets/hero-features-1.png";
import img2 from "@/assets/hero-features-2.png";
import img3 from "@/assets/hero-features-3.png";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <section className={styles.hero}>
        <div className={styles.copyContainer}>
          <h1 className={styles.copy}>Turbo でより鮮明なゴール設定</h1>
          <p className={styles.copyDescription}>
            理想の生活は何で満たす？大切な時間をときめくタスクでみたそう。
            <br />
            Turbo はそんなあなたの希望を満たすアプリです。
          </p>
          <div className={styles.entryContainer}>
            <Link href="/login">
              <Button variant="primary" className={styles.entry}>
                Turboを始める
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Section
        title="明確なゴール設定"
        description={[
          "大事なことから人生を埋めていこう。",
          "ゴールから逆算する UI で目標へのタスクを可視化。",
          "明確なゴールと鮮明なルートを手に入れて、",
          "理想の生活と日々のモチベーションを手に入れよう。",
        ]}
        image={img1}
        imageAlt="ゴール設定"
      />
      <Section
        title="明確なマイルストーンとモチベーション管理"
        description={[
          "明確なマイルストーンがモチベーション維持の鍵。",
          "Turbo は自由なマイルストーン設定を助けます。",
          "適切な目標のブレイクダウンで、",
          "理想の生活と日々のモチベーションを手に入れよう。",
        ]}
        image={img2}
        imageAlt="マイルストーン管理"
      />
      <Section
        title="直感的で柔軟性に富んだUI"
        description={[
          "最初に組んだ計画が計画通り進むのは稀。",
          "柔軟性に富んだUI で計画の練り直しをサポート。",
          "ストレスの少ないUIで、",
          "シームレスなタスク管理を手に入れよう。",
        ]}
        image={img3}
        imageAlt="ゴール設定"
      />
      <Footer />
    </main>
  );
}
