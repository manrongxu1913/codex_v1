import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const now = new Date().toISOString();

  const sampleEarnings = [
    {
      ticker: "AAPL",
      company_name: "Apple",
      sector: "Information Technology",
      earnings_date: "2026-03-15",
      source: "seed",
      updated_at: now
    },
    {
      ticker: "MSFT",
      company_name: "Microsoft",
      sector: "Information Technology",
      earnings_date: "2026-03-18",
      source: "seed",
      updated_at: now
    },
    {
      ticker: "NVDA",
      company_name: "NVIDIA",
      sector: "Information Technology",
      earnings_date: "2026-03-20",
      source: "seed",
      updated_at: now
    }
  ];

  const sampleNews = [
    {
      news_id: "news-aapl-1",
      title: "Apple earnings expectations updated",
      url: "https://example.com/aapl",
      ticker: "AAPL",
      published_at: now,
      source: "seed",
      updated_at: now
    },
    {
      news_id: "news-msft-1",
      title: "Microsoft cloud growth in focus",
      url: "https://example.com/msft",
      ticker: "MSFT",
      published_at: now,
      source: "seed",
      updated_at: now
    },
    {
      news_id: "news-nvda-1",
      title: "NVIDIA AI demand remains strong",
      url: "https://example.com/nvda",
      ticker: "NVDA",
      published_at: now,
      source: "seed",
      updated_at: now
    }
  ];

  const { error: e1 } = await supabase.from("earnings_events").upsert(sampleEarnings, {
    onConflict: "ticker,earnings_date",
    ignoreDuplicates: false
  });

  const { error: e2 } = await supabase.from("market_news").upsert(sampleNews, {
    onConflict: "news_id",
    ignoreDuplicates: false
  });

  if (e1 || e2) {
    return NextResponse.json({ error: e1?.message || e2?.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    inserted: { earnings: sampleEarnings.length, news: sampleNews.length }
  });
}
