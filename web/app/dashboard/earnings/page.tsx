import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

type Earning = {
  id: number;
  ticker: string;
  company_name: string | null;
  sector: string | null;
  earnings_date: string | null;
  source: string | null;
  updated_at: string | null;
};

type News = {
  id: number;
  news_id: string | null;
  title: string;
  url: string | null;
  ticker: string | null;
  published_at: string | null;
  source: string | null;
};

export default async function EarningsPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: earnings, error: e1 } = await supabase
    .from("earnings_events")
    .select("*")
    .order("earnings_date", { ascending: true })
    .limit(50);

  const { data: news, error: e2 } = await supabase
    .from("market_news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(50);

  if (e1 || e2) {
    return (
      <main style={{ maxWidth: 960, margin: "24px auto", display: "grid", gap: 12 }}>
        <h1>财报与新闻</h1>
        <p>加载失败：{e1?.message || e2?.message}</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 960, margin: "24px auto", display: "grid", gap: 20 }}>
      <h1>财报与新闻（数据库实时）</h1>

      <section>
        <h2>财报日程</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {(earnings as Earning[] | null)?.map((x) => (
            <div key={x.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10 }}>
              <strong>{x.ticker}</strong> - {x.company_name || "-"} - {x.sector || "-"} - {x.earnings_date || "-"}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>财经新闻</h2>
        <div style={{ display: "grid", gap: 8 }}>
          {(news as News[] | null)?.map((x) => (
            <div key={x.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10 }}>
              <strong>{x.ticker || "MARKET"}</strong> - {x.title}
              {x.url ? (
                <>
                  {" "}
                  - <a href={x.url} target="_blank" rel="noreferrer">链接</a>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
