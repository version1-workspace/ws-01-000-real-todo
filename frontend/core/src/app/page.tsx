import styles from "./page.module.scss";
import Image from "next/image";
import Link from "next/link";
import reviewImage1 from "@/assets/review-1.jpg";
import reviewImage2 from "@/assets/review-2.jpg";
import reviewImage3 from "@/assets/review-3.jpg";
import Header from "@/components/shared/header/public";
import Footer from "@/components/shared/footer";
import { join } from "@/lib/cls";
import Icon from "@/components/shared/icon";

function CheckIcon() {
  return (
    <div className={styles.planIcon}>
      <div className={styles.iconCircle}>
        <Icon name="complete" color="#4BCAA0" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.hero}>
        <div className={styles.copy}>
          <h1 className={styles.copyText}>
            <span className={styles.firstLine}>
              <span className={styles.gradient}>Transform</span> your tasks
            </span>
            <span className={styles.secondLine}>
              into <span className={styles.gradient}>acheivements</span>
            </span>
          </h1>
          <p className={styles.copySubText}>
            TODO app that revolutionizes your life and helps you achieve your
            dreams.
          </p>
          <Link href="/login" className={join(styles.cta, styles.ctaAnimation)}>
            無料で始める
          </Link>
        </div>
      </div>
      <div className={styles.features}>
        <div className={styles.col}>
          <h2 className={styles.featureTitle}>ゴールを鮮明にイメージ</h2>
          <div className={styles.featureDescription}>
            さまざまな角度から練られた目標は目標達成のために必要不可欠な要素です。Turvo
            .では、具体的な期日や目標達成までに必要な意識を設定して、あなたの目標達成を助けます。
          </div>
        </div>
        <div className={styles.col}>
          <h2 className={styles.featureTitle}>精緻な計画をサポート</h2>
          <div className={styles.featureDescription}>
            Turvo
            ではマイルストーン（中間目標）を設定することができます。長い道のりでも迷わずにゴールに向かえるような計画策定を助けます。マイルストーンを設定してより精緻な計画を作り上げましょう。
          </div>
        </div>
        <div className={styles.col}>
          <h2 className={styles.featureTitle}>シンプルなUI</h2>
          <div className={styles.featureDescription}>
            Turvo
            は見やすいダッシュボードで複数の目標を管理することができます。仕事の目標、キャリアの目標、プライベートの目標など個人に関係する目標をまとめて管理することができます。
          </div>
        </div>
      </div>
      <div className={styles.price}>
        <div className={styles.priceHeader}>
          <h2 className={styles.priceHeaderTitle}>料金</h2>
          <p className={styles.priceSubHeader}>
            ※
            学習用アプリなので、ダミーの料金表です。プランに関する機能は未実装です。
          </p>
        </div>
        <div className={styles.priceContent}>
          <div className={styles.priceTable}>
            <div className={styles.priceCol}>
              <div className={styles.planContainer}>
                <div className={styles.planHeader}>
                  <div className={styles.planName}>Basic</div>
                  <div className={styles.planDescription}>
                    無料のプランでTurvoを始めよう。
                    スタートには十分なプランを揃えて お待ちしております。
                  </div>
                  <div className={styles.planPrice}>
                    <span className={styles.gradient}>Free</span>
                    <p className={styles.priceTag}>円 / 月</p>
                  </div>
                </div>
                <div className={styles.planBody}>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      3つまでプロジェクトを管理可能
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      ダッシュボード機能を無制限 に利用可能
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      無料の範囲内でのテーマの選択・ 変更可能
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      デフォルトのリマインダの利用 可能
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      一部のWeb API の利用可能
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.priceCol}>
              <div className={styles.planContainer}>
                <div className={styles.planHeader}>
                  <div className={styles.planName}>Professional</div>
                  <div className={styles.planDescription}>
                    多くのプロジェクトを管理したくなったら Professional
                    プランにアップグレードして Turvo の機能を使い切りましょう
                  </div>
                  <div className={styles.planPrice}>
                    <span className={styles.gradient}>980</span>
                    <p className={styles.priceTag}>円 / 月</p>
                  </div>
                </div>
                <div className={styles.planBody}>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      無制限にプロジェクトを管理可能
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      ダッシュボード機能を無制限 に利用可能
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      無制限でテーマの選択・変更可能
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      リマインダ・カスタマイズ機能 使用可
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      一部のWeb API の利用可能
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.priceCol}>
              <div className={styles.planContainer}>
                <div className={styles.planHeader}>
                  <div className={styles.planName}>Premium</div>
                  <div className={styles.planDescription}>
                    Professionalプランの機能に加えて Web
                    APIが利用可能でタスク管理を
                    自分なりにカスタマイズしてさらなる 効率化を目指しましょう。
                  </div>
                  <div className={styles.planPrice}>
                    <span className={styles.gradient}>1,980</span>
                    <p className={styles.priceTag}>円 / 月</p>
                  </div>
                </div>
                <div className={styles.planBody}>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      無制限にプロジェクトを管理可能
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      ダッシュボード機能を無制限 に利用可能
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      無制限でテーマの選択・変更可能
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      リマインダ・カスタマイズ機能 使用可
                    </p>
                  </div>
                  <div className={styles.planRow}>
                    <CheckIcon />
                    <p className={styles.planRowBody}>
                      全てのWeb API の利用可能
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.review}>
        <div className={styles.reviewHeader}>
          <h2 className={styles.reviewHeaderTitle}>ユーザーの声</h2>
        </div>
        <div className={styles.reviewContent}>
          <div className={styles.reviewCol}>
            <div className={styles.reviewColHeader}>
              <div className={styles.reviewAvatar}>
                <Image
                  className={styles.reviewAvatarImage}
                  src={reviewImage1}
                  alt="アバター"
                />
              </div>
              <div className={styles.reviewProfile}>
                <p>Roberto Dixon</p>
                <p>ソフトウェアエンジニア</p>
              </div>
            </div>
            <div className={styles.reviewColContent}>
              <p className={styles.reviewDescription}>
                Turvo は自分の目標を管理するのに最適なツールです。 わかりやすい
                UI で登録したその日からすぐに活躍してくれました。
              </p>
            </div>
          </div>
          <div className={styles.reviewCol}>
            <div className={styles.reviewColHeader}>
              <div className={styles.reviewAvatar}>
                <Image
                  className={styles.reviewAvatarImage}
                  src={reviewImage2}
                  alt="アバター"
                />
              </div>
              <div className={styles.reviewProfile}>
                <p>Carolyn Obrien</p>
                <p>英語教師</p>
              </div>
            </div>
            <div className={styles.reviewColContent}>
              <p className={styles.reviewDescription}>
                Turvo
                で自分の仕事とプライベートをうまくバランスできるようになりました。
                仕事もプライベートもお互いに干渉するものですが、Turvo
                でそれらをまとめて管理できます。
              </p>
            </div>
          </div>
          <div className={styles.reviewCol}>
            <div className={styles.reviewColHeader}>
              <div className={styles.reviewAvatar}>
                <Image
                  className={styles.reviewAvatarImage}
                  src={reviewImage3}
                  alt="アバター"
                />
              </div>
              <div className={styles.reviewProfile}>
                <p>Edward Hopkins</p>
                <p>写真家</p>
              </div>
            </div>
            <div className={styles.reviewColContent}>
              <p className={styles.reviewDescription}>
                Turvoのリマインド機能で常に長期の計画を意識しながら自分のプロジェクトを進めることができます。
                長期の計画でも迷子にならずに進むのに最適なツールです。
              </p>
            </div>
          </div>
        </div>
        <div className={styles.reviewFooter}>
          <Link href="/login" className={styles.cta}>
            Turvo を始める
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
