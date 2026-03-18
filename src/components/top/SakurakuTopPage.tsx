"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, CalendarDays, LogIn, LogOut, MapPin, UserRoundCog, Clock3, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MENU_DATA = [
  {
    id: "initial",
    label: "初回コース（はじめての方）",
    accent: "初回",
    items: [
      {
        name: "初回コース",
        duration: "90分",
        price: "5,000円",
        reserveBlock: "確保120分",
        description:
          "はじめての方専用のコースになります。\n\n「どこに行っても良くならない」\n「慢性的なコリやハリがつらい」\n「強く（弱く）揉まれるのが苦手、揉み返しが心配」\n\nそんなお悩みをお持ちの方もご安心ください。\n丁寧に一つずつ、お身体の状態や不調の原因を探りながら\n最適な施術にて対応させていただきます。",
        optionRule: "初回限定",
      },
    ],
  },
  {
    id: "seitai",
    label: "整体コース（メンテナンス）",
    accent: "定期ケア",
    items: [
      {
        name: "60分",
        duration: "60分",
        price: "5,000円",
        reserveBlock: "確保90分",
        description: "定期的なお身体のメンテナンスに\nアフターティー付",
        optionRule: "オプション追加可",
      },
      {
        name: "90分",
        duration: "90分",
        price: "7,000円",
        reserveBlock: "確保120分",
        description: "定期的なお身体のメンテナンスに\nアフターティー付",
        optionRule: "オプション追加可",
      },
      {
        name: "120分",
        duration: "120分",
        price: "9,000円",
        reserveBlock: "確保150分",
        description: "定期的なお身体のメンテナンスに\nアフターティー付",
        optionRule: "オプション追加可",
      },
    ],
  },
  {
    id: "shinsei",
    label: "深整コース（プレミアム）",
    accent: "おすすめ",
    note: "辛い疲れ・不調がある方へ",
    items: [
      {
        name: "回復 90分",
        duration: "90分",
        price: "9,000円",
        reserveBlock: "確保150分",
        description:
          "整体+オイル、マグバーム、よもぎ蒸しパッド、ホットストーンを\nお身体の状態に合わせて使用し、お辛い箇所・不調を整えます\nウェルカムティー、アフターティー付",
        optionRule: "オプション追加不可",
      },
      {
        name: "深巡 120分",
        duration: "120分",
        price: "12,000円",
        reserveBlock: "確保180分",
        description:
          "整体、オイル、マグバーム、よもぎ蒸しパッド、ホットストーンを\nお身体の状態に合わせて使用し、お辛い箇所・不調を整えます\nウェルカムティー、アフターティー付",
        optionRule: "オプション追加不可",
        featured: true,
      },
    ],
  },
  {
    id: "kaihou",
    label: "解放コース（フルケア）",
    accent: "全身フルケア",
    items: [
      {
        name: "180分",
        duration: "180分",
        price: "18,900円",
        reserveBlock: "確保240分",
        description:
          "お身体+フェイシャル+ヘッド\n温巡ケア、フェイシャル、頭蓋筋膜リリース、自律神経を調整する全身フルケアコース\n整体、オイル、マグバーム、よもぎ蒸しパッド、ホットストーン、カッサ、美容パック付\nウェルカムティー、アフターティー付",
        optionRule: "オプション追加不可",
      },
    ],
  },
] as const;

const OPTION_DATA = [
  {
    name: "マグポイントケア",
    price: "+1,000円",
    reserveBlock: "確保0分",
    description: "マグネシウムバームをコリ、ハリの気になる部分に塗布します",
  },
  {
    name: "温巡ケア",
    price: "+1,000円",
    reserveBlock: "確保0分",
    description: "ホットストーン、よもぎ蒸しパッド、蒸しタオルをご利用いただけます",
  },
  {
    name: "シェイプケア 1部位",
    price: "+2,000円",
    reserveBlock: "確保30分",
    description:
      "背中・お腹・二の腕・脚など、気になる箇所のシェイプアップに",
  },
  {
    name: "シェイプケア 2部位",
    price: "+3,500円",
    reserveBlock: "確保30分",
    description:
      "背中・お腹・二の腕・脚など、気になる箇所のシェイプアップに",
  },
  {
    name: "シェイプケア 3部位",
    price: "+5,000円",
    reserveBlock: "確保60分",
    description:
      "背中・お腹・二の腕・脚など、気になる箇所のシェイプアップに",
  },
  {
    name: "頭蓋リリース＆フェイスケア",
    price: "+3,000円",
    reserveBlock: "確保30分",
    description:
      "噛みしめ・食いしばり、頭痛や眼精疲労のある方におすすめ\n（顎、耳周り、首、頭皮まで含みます）",
  },
] as const;

const SAMPLE_SLOTS = [
  { time: "09:00", open: false },
  { time: "09:30", open: false },
  { time: "10:00", open: false },
  { time: "10:30", open: false },
  { time: "11:00", open: true },
  { time: "11:30", open: false },
  { time: "12:00", open: true },
  { time: "12:30", open: false },
  { time: "13:00", open: false },
  { time: "13:30", open: true },
  { time: "14:00", open: false },
  { time: "14:30", open: false },
  { time: "15:00", open: true },
  { time: "15:30", open: false },
  { time: "16:00", open: false },
  { time: "16:30", open: true },
  { time: "17:00", open: false },
  { time: "17:30", open: false },
  { time: "18:00", open: true },
  { time: "18:30", open: false },
  { time: "19:00", open: true },
  { time: "19:30", open: false },
  { time: "20:00", open: false },
  { time: "20:30", open: false },
  { time: "21:00", open: false },
] as const;

function SectionTitle({ eyebrow, title, body }: { eyebrow?: string; title: string; body?: string }) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center">
      {eyebrow ? (
        <div className="mb-2 text-sm tracking-[0.28em] text-[#6E8B63] uppercase">{eyebrow}</div>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-wide text-[#5C4637] md:text-3xl">{title}</h2>
      {body ? <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#6E5B4D] md:text-base">{body}</p> : null}
    </div>
  );
}

function DetailModal({
  open,
  title,
  subtitle,
  description,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  description: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-[28px] border border-white/60 bg-[#F8F3EA] p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-[#5C4637]">{title}</div>
                {subtitle ? <div className="mt-1 text-sm text-[#8A6B61]">{subtitle}</div> : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#D8C8B6] p-2 text-[#7A5B4F] transition hover:bg-white/70"
                aria-label="閉じる"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="whitespace-pre-line text-sm leading-7 text-[#6E5B4D] md:text-base">{description}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function MenuCard({
  section,
  onOpen,
}: {
  section: (typeof MENU_DATA)[number];
  onOpen: (title: string, subtitle: string, description: string) => void;
}) {
  return (
    <Card className="h-full rounded-[28px] border border-white/60 bg-[#FBF7F0]/90 shadow-[0_18px_55px_rgba(92,70,55,0.10)] backdrop-blur">
      <CardContent className="p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.22em] text-[#8C9E73] uppercase">{section.accent}</div>
            <h3 className="mt-2 text-xl font-semibold text-[#5C4637]">{section.label}</h3>
            {"note" in section && section.note ? <p className="mt-2 text-sm text-[#7A6255]">{section.note}</p> : null}
          </div>
          {section.id === "shinsei" ? (
            <span className="rounded-full bg-[#C87673]/12 px-3 py-1 text-xs font-medium text-[#B86367]">人気</span>
          ) : null}
        </div>

        <div className="mt-6 space-y-4">
          {section.items.map((item) => (
            <button
              key={`${section.id}-${item.name}`}
              type="button"
              onClick={() =>
                onOpen(
                  `${section.label}｜${item.name}`,
                  `${item.duration} / ${item.price} / ${item.reserveBlock} / ${item.optionRule}`,
                  item.description,
                )
              }
              className={`w-full rounded-[22px] border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                "featured" in item && item.featured
                  ? "border-[#D99A92] bg-[#FFF7F4]"
                  : "border-[#E6D8C9] bg-white/75 hover:bg-white"
              }`}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-base font-semibold text-[#5C4637]">{item.name}</div>
                  <div className="mt-1 text-sm text-[#7A6255]">{item.reserveBlock}</div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8A6B61] md:text-base">
                  <span>{item.duration}</span>
                  <span>・</span>
                  <span className="font-semibold text-[#C46C72]">{item.price}</span>
                </div>
              </div>
              <div className="mt-3 text-sm text-[#7C6757]">タップで説明を見る</div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function OptionCard({
  item,
  onOpen,
}: {
  item: (typeof OPTION_DATA)[number];
  onOpen: (title: string, subtitle: string, description: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item.name, `${item.price} / ${item.reserveBlock}`, item.description)}
      className="rounded-[22px] border border-[#E6D8C9] bg-white/75 p-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-base font-semibold text-[#5C4637]">{item.name}</div>
        <div className="text-sm text-[#C46C72]">{item.price}</div>
      </div>
      <div className="mt-2 text-sm text-[#7A6255]">{item.reserveBlock}</div>
      <div className="mt-3 text-sm text-[#7C6757]">タップで説明を見る</div>
    </button>
  );
}

export default function SakurakuTopPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modal, setModal] = useState<{ title: string; subtitle?: string; description: string } | null>(null);

  const navItems = useMemo(() => {
    if (!isLoggedIn) {
      return [
        { icon: CalendarDays, label: "予約する", action: () => alert("次の段階で予約画面へ接続します") },
        { icon: LogIn, label: "新規登録 / ログイン", action: () => setIsLoggedIn(true) },
        { icon: MapPin, label: "店舗情報", action: () => alert("次の段階で店舗情報ページへ接続します") },
      ];
    }

    return [
      { icon: CalendarDays, label: "予約する", action: () => alert("次の段階で予約画面へ接続します") },
      { icon: Clock3, label: "予約状況の確認", action: () => alert("次の段階で予約確認画面へ接続します") },
      { icon: MapPin, label: "店舗情報", action: () => alert("次の段階で店舗情報ページへ接続します") },
      {
        icon: LogOut,
        label: "ログアウト",
        action: () => {
          setIsLoggedIn(false);
          setIsAdmin(false);
        },
      },
    ];
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-[#F6F0E6] text-[#5C4637]">
      <DetailModal
        open={!!modal}
        title={modal?.title ?? ""}
        subtitle={modal?.subtitle}
        description={modal?.description ?? ""}
        onClose={() => setModal(null)}
      />

      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg-main.jpg')" }}
        />
        

        <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="flex items-center"
            >
             
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={() => alert("次の段階で予約導線へ接続します")}
                    className="rounded-full border border-white/70 bg-[#A27C5B] px-7 py-6 text-lg font-medium text-[#C46C72] shadow-lg transition hover:bg-[#936F51]"
                  >
                    <span className="[text-shadow:_0_0_1px_#fff,_0_0_1px_#fff,_0_0_1px_#fff]">予約する</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsLoggedIn((v) => !v)}
                    className="rounded-full border-white/60 bg-white/10 px-7 py-6 text-[#F7EFE6] backdrop-blur hover:bg-white/20"
                  >
                    {isLoggedIn ? "ログイン状態をOFFにする" : "ログイン状態を試す"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsLoggedIn(true);
                      setIsAdmin((v) => !v);
                    }}
                    className="rounded-full border-white/60 bg-white/10 px-7 py-6 text-[#F7EFE6] backdrop-blur hover:bg-white/20"
                  >
                    管理者表示を試す
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="flex items-center justify-center"
            >
              <div className="w-full max-w-xl rounded-[32px] border border-white/45 bg-[#F7F0E7]/88 p-5 shadow-[0_18px_60px_rgba(30,22,18,0.22)] backdrop-blur md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs tracking-[0.22em] text-[#8C9E73] uppercase">Top Menu</div>
                    <div className="mt-1 text-xl font-semibold text-[#5C4637]">
                      {isLoggedIn ? "ご予約メニュー" : "ご来店ガイド"}
                    </div>
                  </div>
                  {isAdmin ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#D98886]/12 px-3 py-1 text-sm text-[#B55F68]">
                      <UserRoundCog className="h-4 w-4" /> 管理者
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-3">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={item.action}
                        className="flex items-center justify-between rounded-[24px] border border-[#E3D4C6] bg-white/80 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-[#EFE6D8] p-2 text-[#7D6556]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-base font-medium text-[#5C4637]">{item.label}</span>
                        </div>
                        <span className="text-sm text-[#A78374]">→</span>
                      </button>
                    );
                  })}

                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => alert("次の段階で管理画面へ接続します")}
                      className="flex items-center justify-between rounded-[24px] border border-[#D9B6B4] bg-[#FFF4F2] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-[#F2DFDA] p-2 text-[#B15C65]">
                          <UserRoundCog className="h-5 w-5" />
                        </div>
                        <span className="text-base font-medium text-[#7A4E54]">管理画面</span>
                      </div>
                      <span className="text-sm text-[#B66A71]">→</span>
                    </button>
                  ) : null}
                </div>

                <div className="mt-5 rounded-[24px] border border-[#E6D8C9] bg-white/75 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-sm font-medium text-[#6A5448]">空き表示イメージ</div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-semibold text-[#C46C72]">◎ 空きあり</span>
                      <span className="font-semibold text-[#C7C4C0]">✕ 満枠</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                    {SAMPLE_SLOTS.map((slot) => (
                      <div key={slot.time} className="rounded-2xl border border-[#EDE2D6] bg-[#FCFAF7] px-2 py-2 text-center">
                        <div className="text-[11px] text-[#846B5A]">{slot.time}</div>
                        <div className={`mt-1 text-lg font-semibold ${slot.open ? "text-[#C46C72]" : "text-[#CAC7C2]"}`}>
                          {slot.open ? "◎" : "✕"}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-6 text-[#846B5A]">
                    表示上の枠は 9:00〜21:00。初期営業時間は 11:00〜20:00 を想定しています。
                    次の段階で管理画面から営業時間・休業日・枠ロックを変更できるようにします。
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <section>
          <SectionTitle
            eyebrow="Menu"
            title="施術メニュー"
            body={"気になるメニューをタップすると、説明文がポップアップで開きます。\n深整コースはオプション追加不可、オプションは整体コースにのみ追加可の想定です。"}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {MENU_DATA.map((section) => (
              <MenuCard
                key={section.id}
                section={section}
                onOpen={(title, subtitle, description) => setModal({ title, subtitle, description })}
              />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <SectionTitle
            eyebrow="Option"
            title="整体コースに追加できるオプション"
            body="オプションは整体コースにのみ追加可能です。気になる項目をタップすると詳細が開きます。"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {OPTION_DATA.map((item) => (
              <OptionCard
                key={item.name}
                item={item}
                onOpen={(title, subtitle, description) => setModal({ title, subtitle, description })}
              />
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-[28px] border-white/60 bg-[#FBF7F0] shadow-[0_18px_55px_rgba(92,70,55,0.08)]">
            <CardContent className="p-6 md:p-7">
              <div className="text-xs tracking-[0.22em] text-[#8C9E73] uppercase">Guide</div>
              <h3 className="mt-2 text-2xl font-semibold text-[#5C4637]">ご紹介特典について</h3>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[#6E5B4D] md:text-base">
                <p>ご紹介いただいた方・ご紹介でご来店された方、それぞれに「500円OFFチケット」をお渡ししております。</p>
                <ul className="space-y-1">
                  <li>・次回以降のお会計時にご利用いただけます</li>
                  <li>・1回のご来店につき1枚までご利用可能です</li>
                  <li>・他の割引との併用はできません</li>
                  <li>・有効期限がございます</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-white/60 bg-[#FFF8F6] shadow-[0_18px_55px_rgba(92,70,55,0.08)]">
            <CardContent className="p-6 md:p-7">
              <div className="text-xs tracking-[0.22em] text-[#C07A76] uppercase">Reminder Mail</div>
              <h3 className="mt-2 text-2xl font-semibold text-[#6A4C45]">前日メール文面</h3>
              <div className="mt-4 whitespace-pre-line rounded-[20px] border border-[#E7D6D1] bg-white/80 p-4 text-sm leading-7 text-[#6E5B4D]">
                件名：{"\n"}【さく楽】明日のご予約確認{"\n\n"}本文：{"\n"}いつもご利用ありがとうございます。{"\n\n"}明日〇月〇日（曜日）　〇時〇分～〇時〇分{"\n"}〇〇コース：〇〇分{"\n"}（オプション表示）{"\n\n"}にてご予約を承っております。{"\n"}ご来店を心よりお待ちしております。{"\n\n"}※当日ご変更がある場合はLINEにてご連絡ください。
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
