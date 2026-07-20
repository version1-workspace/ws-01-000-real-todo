"use client";

import { useState } from "react";
import Button from "@/components/shared/button";
import Checkbox from "@/components/shared/checkbox";
import Icon, { IconName } from "@/components/shared/icon";
import Input from "@/components/shared/input/text";
import Pagination from "@/components/shared/pagination";
import PopupMenu from "@/components/shared/popupMenu";
import Select, { OptionItem } from "@/components/shared/select";
import Switcher from "@/components/shared/switcher";
import { useToast } from "@/lib/toast/hook";
import styles from "./page.module.css";

const selectOptions: OptionItem[] = [
  { label: "進行中", value: "active" },
  { label: "レビュー待ち", value: "review" },
  { label: "完了", value: "done" },
];

const dropdownOptions: OptionItem[] = [
  {
    label: (
      <span className={styles.dropdownOption}>
        <Icon name="person" size={16} />
        プロフィール
      </span>
    ),
    value: "profile",
  },
  {
    label: (
      <span className={styles.dropdownOption}>
        <Icon name="settings" size={16} />
        設定
      </span>
    ),
    value: "settings",
  },
  {
    label: (
      <span className={styles.dropdownOption}>
        <Icon name="notification" size={16} />
        通知設定
      </span>
    ),
    value: "notification",
  },
];

const statusCards = [
  {
    label: "Components",
    value: "12",
    description: "共有 UI",
    icon: "layout",
  },
  {
    label: "Tokens",
    value: "8",
    description: "カラー / 余白",
    icon: "bulb",
  },
  {
    label: "States",
    value: "5",
    description: "操作状態",
    icon: "check",
  },
] satisfies {
  label: string;
  value: string;
  description: string;
  icon: IconName;
}[];

const iconSamples = [
  "dashboard",
  "project",
  "tasks",
  "filter",
  "search",
  "calendar",
  "notification",
  "settings",
] satisfies IconName[];

export default function Page() {
  const { info, success, error } = useToast();
  const [inputValue, setInputValue] = useState("UI カタログ");
  const [selectValue, setSelectValue] = useState("active");
  const [dropdownValue, setDropdownValue] = useState("profile");
  const [page, setPage] = useState(2);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Turvo Dev</p>
          <h1 className={styles.title}>UI Catalog</h1>
        </div>
        <div className={styles.headerAction}>
          <Button variant="primary" onClick={() => success("保存しました")}>
            保存
          </Button>
        </div>
      </header>

      <section className={styles.summaryGrid}>
        {statusCards.map((item) => (
          <article className={styles.summaryCard} key={item.label}>
            <div className={styles.summaryIcon}>
              <Icon name={item.icon} size={18} />
            </div>
            <div>
              <p className={styles.summaryLabel}>{item.label}</p>
              <p className={styles.summaryValue}>{item.value}</p>
              <p className={styles.summaryDescription}>{item.description}</p>
            </div>
          </article>
        ))}
      </section>

      <div className={styles.catalogGrid}>
        <Section title="Buttons" description="主要操作と補助操作">
          <div className={styles.buttonGrid}>
            <Button variant="primary" onClick={() => success("作成しました")}>
              作成
            </Button>
            <Button variant="secondary" onClick={() => info("確認しました")}>
              確認
            </Button>
            <Button onClick={() => error("取り消しました")}>取消</Button>
          </div>
        </Section>

        <Section title="Forms" description="入力、選択、切り替え">
          <div className={styles.fieldStack}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>テキスト</span>
              <Input
                value={inputValue}
                icon={<Icon name="search" size={16} />}
                placeholder="キーワード"
                onChange={(event) => setInputValue(event.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>ステータス</span>
              <Select
                data={selectOptions}
                value={selectValue}
                defaultOption={selectOptions[0]}
                onSelect={(item) => setSelectValue(item.value)}
              />
            </label>
            <div className={styles.inlineControls}>
              <Checkbox
                label="通知を有効にする"
                defaultValue={true}
                onClick={() => undefined}
              />
              <div className={styles.switchControl}>
                <span>公開</span>
                <Switcher />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Icons" description="ナビゲーションと状態表示">
          <ul className={styles.iconGrid}>
            {iconSamples.map((name) => (
              <li className={styles.iconItem} key={name}>
                <Icon name={name} size={20} />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Feedback" description="通知とメニュー">
          <div className={styles.feedbackStack}>
            <div className={styles.buttonGrid}>
              <Button onClick={() => info("情報を表示しました")}>Info</Button>
              <Button onClick={() => success("処理が完了しました")}>
                Success
              </Button>
              <Button onClick={() => error("エラーが発生しました")}>
                Error
              </Button>
            </div>
            <div className={styles.menuRow}>
              <PopupMenu
                trigger={
                  <button className={styles.iconButton} type="button">
                    <Icon name="menu" size={18} />
                  </button>
                }
                actions={[
                  {
                    key: "edit",
                    text: "編集",
                    logo: <Icon name="edit" size={16} />,
                    onClick: () => info("編集を選択しました"),
                  },
                  {
                    key: "archive",
                    text: "アーカイブ",
                    logo: <Icon name="archive" size={16} />,
                    onClick: () => success("アーカイブしました"),
                  },
                  {
                    key: "remove",
                    text: "削除",
                    danger: true,
                    logo: <Icon name="remove" size={16} />,
                    onClick: () => error("削除しました"),
                  },
                ]}
              />
              <Pagination
                page={page}
                pageCount={4}
                hasPrevious={page > 1}
                hasNext={page < 4}
                onFetch={setPage}
              />
            </div>
          </div>
        </Section>

        <Section title="Popup Menu" description="一覧やカードの行操作">
          <div className={styles.popupPreview}>
            <div>
              <p className={styles.previewTitle}>山田 花子</p>
              <p className={styles.previewText}>yamada@example.com</p>
            </div>
            <PopupMenu
              header={
                <div className={styles.popupHeader}>
                  <div className={styles.avatar}>山</div>
                  <div>
                    <p className={styles.popupHeaderName}>山田 花子</p>
                    <p className={styles.popupHeaderMail}>yamada@example.com</p>
                  </div>
                </div>
              }
              trigger={
                <button
                  aria-label="ユーザーメニューを開く"
                  className={styles.iconButton}
                  type="button"
                >
                  <Icon name="menu" size={18} />
                </button>
              }
              actions={[
                {
                  key: "profile",
                  text: "プロフィール",
                  logo: <Icon name="person" size={16} />,
                  onClick: () => info("プロフィールを選択しました"),
                },
                {
                  key: "settings",
                  text: "設定",
                  logo: <Icon name="settings" size={16} />,
                  onClick: () => success("設定を選択しました"),
                },
                {
                  key: "notification",
                  text: "通知設定",
                  logo: <Icon name="notification" size={16} />,
                  onClick: () => info("通知設定を選択しました"),
                },
                {
                  key: "help",
                  text: "ヘルプセンター",
                  divider: true,
                  logo: <Icon name="help" size={16} />,
                  onClick: () => info("ヘルプセンターを選択しました"),
                },
                {
                  key: "contact",
                  text: "お問い合わせ",
                  logo: <Icon name="mail" size={16} />,
                  onClick: () => info("お問い合わせを選択しました"),
                },
                {
                  key: "logout",
                  text: "ログアウト",
                  danger: true,
                  divider: true,
                  logo: <Icon name="logout" size={16} />,
                  onClick: () => error("ログアウトを選択しました"),
                },
              ]}
            />
          </div>
        </Section>

        <Section title="Dropdown" description="選択肢のプルダウン">
          <div className={styles.dropdownPreview}>
            <div>
              <p className={styles.previewTitle}>ヘッダーメニュー</p>
              <p className={styles.previewText}>アイコン付きの選択 UI</p>
            </div>
            <div className={styles.dropdownControl}>
              <Select
                data={dropdownOptions}
                value={dropdownValue}
                defaultOption={dropdownOptions[0]}
                onSelect={(item) => {
                  setDropdownValue(item.value);
                  info(`${item.value} を選択しました`);
                }}
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <p className={styles.sectionDescription}>{description}</p>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
