import styles from "./page.module.scss";
import Header from "@/components/shared/header/public";
import Footer from "@/components/shared/footer";
import Image from "next/image";
import Button from "@/components/shared/button";
import Section from "@/components/section";
import Link from "next/link";
import star from "@/assets/star.svg";
import starLight from "@/assets/star-light.svg";
import featuresNewProject from "@/assets/features-new-project.png";
import featuresMilestone from "@/assets/features-milestone.png";
import featuresDashoboard from "@/assets/features-dashboard.png";
import featuresUI from "@/assets/features-ui.png";
import reviewImage1 from "@/assets/review-1.jpg";
import reviewImage2 from "@/assets/review-2.jpg";
import reviewImage3 from "@/assets/review-3.jpg";
import { join } from "@/lib/cls";

function Stars({ count }: { count: number }) {
  return (
    <>
      {new Array(count).fill(0).map((_, i) => (
        <>
          <div
            key={`star-${i}`}
            className={join(styles.bgStar, styles.bgStarYellow)}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}></div>
          <div
            key={`star-${i}`}
            className={join(styles.bgStar, styles.bgStarSkyblue)}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}></div>
          <div
            key={`star-${i}`}
            className={join(styles.bgStar, styles.bgStarRed)}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}></div>
          <div
            key={`star-${i}`}
            className={join(styles.bgStar, styles.bgStarGray)}
            style={{
              position: "absolute",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}></div>
        </>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.hero}>
        <Stars count={60} />
        <Image className={styles.star} src={star} alt="star" />
        <div className={styles.starLight}>
          <Image
            className={styles.starLightImage}
            src={starLight}
            alt="star light"
          />
        </div>
      </div>
      <div className={styles.heroSpace}></div>
      <div className={styles.heroContainer}>
        <div className={styles.copyContainer}>
          <div className={styles.catchCopy}>
            <h1 className={styles.catchCopyText}>
              確実に夢をかなえる TODO アプリ
            </h1>
          </div>
          <div className={styles.catchBody}>
            <p className={styles.catchBodyText}>
              Turvoは確実に夢を叶えたいあなたへのタスク管理アプリです。
            </p>
            <p className={styles.catchBodyText}>
              目標を鮮明にイメージしてゴールへの歩みを加速させましょう。
            </p>
          </div>
          <div className={styles.catchFooter}>
            <Link href="/login">
              <Button
                variant="primary"
                style={{
                  padding: "18px",
                  fontSize: "18px",
                }}>
                Turvoを始める
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.background}>
        <div className={styles.features}>
          <Section
            title="ゴールを鮮明にイメージ"
            elements={[
              {
                description: [
                  `さまざまな角度から練られた目標は目標達成のために必要不可欠な要素です。
Turvo では、具体的な期日や目標達成までに必要な意識を設定して、
ユーザ様の目標達成を助けます。`,
                ],
                image: featuresNewProject,
                alt: "目標設定",
              },
            ]}
          />
          <Section
            title="マイルストーン管理でより精緻な計画策定"
            elements={[
              {
                description: [
                  `Turvo ではマイルストーン（中間目標）を設定することができます。
長い道のりでも迷わずにゴールに向かえるような計画策定を助けます。
マイルストーンを設定してより精緻な計画を作り上げましょう。`,
                ],
                image: featuresMilestone,
                alt: "マイルストーン",
              },
            ]}
          />
          <Section
            title="シンプルなUIで複数の目標・タスクを管理"
            elements={[
              {
                description: [
                  `Turvo はシンプルなダッシュボードで複数の目標を管理することができます。
仕事の目標、キャリアの目標、プライベートの目標など個人に関係する目標をまとめて管理することができます。 `,
                ],
                image: featuresDashoboard,
                alt: "シンプルなUI",
              },
              {
                description: [
                  ` Turvo はシンプルでタスク管理に集中できるUIを提供します。Turvoで日々のタスクをゴールへの一段一段を明確にしていきましょう。`,
                ],
                image: featuresUI,
                alt: "シンプルなUI",
              },
            ]}
          />
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
              <div
                className={[styles.priceCol, styles.hideOnlySmartphone].join(
                  " ",
                )}>
                <div className={styles.priceTableHeader}>
                  <div className={styles.priceTableHeaderHeader}></div>
                  <div className={styles.priceTableHeaderBody}>
                    <div className={styles.priceTableHeaderRow}>
                      複数プロジェクト
                    </div>
                    <div className={styles.priceTableHeaderRow}>
                      ダッシュボード
                    </div>
                    <div className={styles.priceTableHeaderRow}>テーマ変更</div>
                    <div className={styles.priceTableHeaderRow}>
                      リマインダー
                    </div>
                    <div className={styles.priceTableHeaderRow}>Web API</div>
                  </div>
                </div>
              </div>
              <div className={styles.priceCol}>
                <div className={styles.planContainer}>
                  <div className={styles.planHeader}>
                    <div className={styles.planName}>フリープラン</div>
                    <div className={styles.planPrice}>無料</div>
                  </div>
                  <div className={styles.planBody}>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>複数プロジェクト</p>
                      <p className={styles.planRowBody}>3つまで</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>ダッシュボード</p>
                      <p className={styles.planRowBody}>◯</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>テーマ変更</p>
                      <p className={styles.planRowBody}>◯</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>リマインダー</p>
                      <p className={styles.planRowBody}>-</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>Web API</p>
                      <p className={styles.planRowBody}>-</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.priceCol}>
                <div className={styles.planContainer}>
                  <div className={styles.planHeader}>
                    <div className={styles.planName}>スタートプラン</div>
                    <div className={styles.planPrice}>
                      980円<span className={styles.priceTag}>/ 月</span>
                    </div>
                  </div>
                  <div className={styles.planBody}>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>複数プロジェクト</p>
                      <p className={styles.planRowBody}>無制限</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>ダッシュボード</p>
                      <p className={styles.planRowBody}>◯</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>テーマ変更</p>
                      <p className={styles.planRowBody}>◯</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>リマインダー</p>
                      <p className={styles.planRowBody}>◯</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>Web API</p>
                      <p className={styles.planRowBody}>-</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.priceCol}>
                <div className={styles.planContainer}>
                  <div className={styles.planHeader}>
                    <div className={styles.planName}>プレミアムプラン</div>
                    <div className={styles.planPrice}>
                      1,980円<span className={styles.priceTag}>/ 月</span>
                    </div>
                  </div>
                  <div className={styles.planBody}>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>複数プロジェクト</p>
                      <p className={styles.planRowBody}>無制限</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>ダッシュボード</p>
                      <p className={styles.planRowBody}>◯</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>テーマ変更</p>
                      <p className={styles.planRowBody}>◯</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>リマインダー</p>
                      <p className={styles.planRowBody}>◯</p>
                    </div>
                    <div className={styles.planRow}>
                      <p className={styles.planRowHeader}>Web API</p>
                      <p className={styles.planRowBody}>◯</p>
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
                  Turvo は自分の目標を管理するのに最適なツールです。
                  <br />
                  <br />
                  わかりやすい UI で登録したその日からすぐに活躍してくれました。
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
                  <br />
                  <br />
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
                  <br />
                  <br />
                  長期の計画でも迷子にならずに進むのに最適なツールです。
                </p>
              </div>
            </div>
          </div>
          <div className={styles.reviewFooter}>
            <Link href="/login">
              <div className={styles.signUpButton}>
                <Button variant="primary">Turvo を始める</Button>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
