const data = window.STOCK_DATA;
const PAGE_SIZE = 30;
const STORAGE_KEY = "stock_workspace_clean_v1";

const toolLinks = [
  ["TradingView", "https://www.tradingview.com/", "图表"],
  ["Yahoo Finance", "https://finance.yahoo.com/", "行情"],
  ["Seeking Alpha", "https://seekingalpha.com/", "财报观点"],
  ["Finviz", "https://finviz.com/", "筛选器"],
  ["SEC EDGAR", "https://www.sec.gov/edgar/search/", "披露"],
  ["Nasdaq", "https://www.nasdaq.com/", "公司信息"]
];

const fortunes = [
  "上上签：按计划执行，稳步推进。",
  "中上签：机会在观察中出现，先小仓验证。",
  "中签：波动正常，纪律优先。",
  "中下签：减少冲动交易，控制风险。",
  "下签：今日宜复盘，不宜激进。"
];

const tarotDeck = [
  { name: "愚者", up: "新的开始，保持开放心态。", rev: "避免冲动，先看清方向。" },
  { name: "魔术师", up: "行动力增强，适合启动计划。", rev: "资源分散，先聚焦一件事。" },
  { name: "女祭司", up: "直觉清晰，宜先观察。", rev: "信息不足，暂缓决策。" },
  { name: "女皇", up: "关系与资源有滋养感。", rev: "避免过度投入，留出边界。" },
  { name: "皇帝", up: "秩序与执行力提升。", rev: "控制欲过强，需弹性。" },
  { name: "教皇", up: "遵循规则更稳。", rev: "打破旧模式，灵活调整。" },
  { name: "恋人", up: "合作与选择迎来机会。", rev: "价值冲突，先统一目标。" },
  { name: "战车", up: "推进力强，可主动出击。", rev: "节奏失衡，先稳再快。" },
  { name: "力量", up: "耐心与韧性是关键。", rev: "情绪波动，注意内耗。" },
  { name: "隐士", up: "适合复盘和深度思考。", rev: "避免封闭，适度沟通。" },
  { name: "命运之轮", up: "转机出现，把握窗口。", rev: "外部变量多，先防守。" },
  { name: "正义", up: "客观判断会带来回报。", rev: "不要情绪化下结论。" },
  { name: "倒吊人", up: "换角度看问题会突破。", rev: "拖延会放大成本。" },
  { name: "死神", up: "旧阶段结束，新周期开启。", rev: "放不下旧路径，影响前进。" },
  { name: "节制", up: "平衡配置，稳中求进。", rev: "过激操作，需回归纪律。" },
  { name: "恶魔", up: "警惕执念与短期诱惑。", rev: "有机会摆脱不良习惯。" },
  { name: "高塔", up: "短期震荡，重建认知。", rev: "变化将至，提前预案。" },
  { name: "星星", up: "希望增强，适合长期布局。", rev: "信心不足，先做小步验证。" },
  { name: "月亮", up: "不确定性高，先求证再行动。", rev: "迷雾减少，逐步清晰。" },
  { name: "太阳", up: "能见度高，执行效率佳。", rev: "避免过度乐观，保留余地。" },
  { name: "审判", up: "阶段总结后会有突破。", rev: "反思不足，可能重复错误。" },
  { name: "世界", up: "阶段圆满，适合升级计划。", rev: "收尾未完成，先补关键短板。" }
];

const tarotSpreads = [
  { name: "过去-现在-未来", positions: ["过去", "现在", "未来"] },
  { name: "现状-建议-结果", positions: ["现状", "建议", "结果"] }
];

const state = {
  view: "home",
  sector: data.GICS_SECTORS[0],
  search: "",
  onlySector: false,
  page: 1,
  selectedTicker: "",
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
  selectedDate: "",
  todo: {
    monthPlans: [],
    dailyPlans: {},
    milestones: []
  }
};

function $(id) { return document.getElementById(id); }
function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ todo: state.todo }));
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.todo) state.todo = parsed.todo;
  } catch {}
}

function setView(viewId) {
  state.view = viewId;
  document.querySelectorAll(".view").forEach((x) => x.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach((x) => x.classList.remove("active"));
  $(viewId).classList.add("active");
  const navBtn = document.querySelector(`.nav-btn[data-view="${viewId}"]`);
  if (navBtn) navBtn.classList.add("active");
}

function buildNav() {
  const views = [
    ["home", "首页"],
    ["earnings", "1. 财报分析"],
    ["todo", "2. Todo 日历"],
    ["tools", "3. 常用软件"],
    ["planner", "4. 资产规划"],
    ["fortune", "5. 运气求签"]
  ];
  $("nav").innerHTML = views.map(([id, label], i) => `<button type="button" class="nav-btn ${i===0?"active":""}" data-view="${id}">${label}</button>`).join("");
}

function buildHome() {
  const cards = [
    ["earnings", "01", "财报分析", "11 行业分类 + 公司池"],
    ["todo", "02", "Todo 日历", "月计划/日计划 + 倒计时"],
    ["tools", "03", "常用软件", "常见站点快速跳转"],
    ["planner", "04", "资产规划", "按比例计算资金分配"],
    ["fortune", "05", "运气求签", "塔罗与求签运势提示"]
  ];
  $("home-grid").innerHTML = cards.map(([view, no, title, desc], i) => `
    <article class="home-card glass ${i === cards.length - 1 ? "full" : ""}" data-jump="${view}">
      <span>${no}</span>
      <h3>${title}</h3>
      <p>${desc}</p>
    </article>
  `).join("");
}

function scoreCompany(c, q) {
  if (!q) return 1;
  const low = q.toLowerCase();
  const ticker = c.ticker.toLowerCase();
  const name = c.name.toLowerCase();
  const sector = c.sector.toLowerCase();
  const zh = (data.SECTOR_ZH[c.sector] || "").toLowerCase();
  const keys = (c.keywords || []).map((k) => k.toLowerCase());
  if (ticker === low) return 1000;
  if (ticker.startsWith(low)) return 800;
  if (ticker.includes(low)) return 700;
  if (name.includes(low)) return 600;
  if (keys.some((k) => k.includes(low) || low.includes(k))) return 550;
  if (sector.includes(low) || zh.includes(low)) return 500;
  return 0;
}

function filteredCompanies() {
  const q = state.search.trim();
  const base = state.onlySector || !q ? (data.BY_SECTOR[state.sector] || []) : data.ALL_COMPANIES;
  if (!q) return base.slice();
  return base
    .map((c) => ({ c, s: scoreCompany(c, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.c);
}

function dayHash(ticker) {
  const n = ticker.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return (n % 75) + 1;
}

function renderSectors() {
  $("sector-list").innerHTML = data.GICS_SECTORS.map((s) => {
    const label = `${data.SECTOR_ZH[s]} / ${s}`;
    return `<button type="button" class="chip ${state.sector===s?"active":""}" data-sector="${s}">${label}</button>`;
  }).join("");
}

function renderCompanyList() {
  const pool = filteredCompanies();
  const max = state.page * PAGE_SIZE;
  const shown = pool.slice(0, max);

  $("company-count").textContent = `当前 ${shown.length} / ${pool.length} 家`;
  $("load-more").hidden = shown.length >= pool.length;

  if (!shown.length) {
    $("company-list").innerHTML = `<p class="muted">没有匹配结果</p>`;
  } else {
    $("company-list").innerHTML = shown.map((c) => {
      const active = state.selectedTicker === c.ticker;
      return `<button type="button" class="chip ${active?"active":""}" data-ticker="${c.ticker}">${c.name} (${c.ticker}) · ${data.SECTOR_ZH[c.sector]}</button>`;
    }).join("");
  }

  if (!state.selectedTicker && shown.length) {
    state.selectedTicker = shown[0].ticker;
  }
  if (state.selectedTicker && !pool.some((x) => x.ticker === state.selectedTicker)) {
    state.selectedTicker = shown[0] ? shown[0].ticker : "";
  }
  renderReport();
  renderUpcoming(pool);
}

function renderReport() {
  if (!state.selectedTicker) {
    $("report-card").innerHTML = "请选择公司";
    return;
  }
  const c = data.ALL_COMPANIES.find((x) => x.ticker === state.selectedTicker);
  if (!c) {
    $("report-card").innerHTML = "未找到公司";
    return;
  }
  const d = dayHash(c.ticker);
  const t = new Date();
  t.setDate(t.getDate() + d);
  const nasdaq = `https://www.nasdaq.com/market-activity/stocks/${c.ticker.toLowerCase()}/earnings`;
  const sec = `https://www.sec.gov/edgar/search/#/q=${c.ticker}`;
  $("report-card").innerHTML = `
    <h4>${c.name} (${c.ticker})</h4>
    <p>行业：${data.SECTOR_ZH[c.sector]} / ${c.sector}</p>
    <p>预计下一财报窗口：${fmtDate(t)}（约 ${d} 天后）</p>
    <p><a href="${nasdaq}" target="_blank" rel="noreferrer">Nasdaq 财报入口</a></p>
    <p><a href="${sec}" target="_blank" rel="noreferrer">SEC EDGAR 入口</a></p>
  `;
}

function renderUpcoming(pool) {
  const list = (pool.length ? pool : data.BY_SECTOR[state.sector])
    .map((c) => ({ c, days: dayHash(c.ticker) }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 10);

  $("upcoming-list").innerHTML = list.map((x) => `<li>${x.c.name} (${x.c.ticker}) · ${x.days} 天后</li>`).join("");
}

function renderEarnings() {
  renderSectors();
  renderCompanyList();
}

function setupEarningsEvents() {
  $("search-input").addEventListener("input", (e) => {
    state.search = e.target.value || "";
    state.page = 1;
    renderEarnings();
  });
  $("only-sector").addEventListener("change", (e) => {
    state.onlySector = !!e.target.checked;
    state.page = 1;
    renderEarnings();
  });
  $("load-more").addEventListener("click", () => {
    state.page += 1;
    renderCompanyList();
  });

  $("sector-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-sector]");
    if (!btn) return;
    state.sector = btn.dataset.sector;
    state.page = 1;
    state.selectedTicker = "";
    renderEarnings();
  });

  $("company-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ticker]");
    if (!btn) return;
    state.selectedTicker = btn.dataset.ticker;
    renderCompanyList();
  });
}

function currentPlanList() {
  if (!state.selectedDate) return state.todo.monthPlans;
  if (!state.todo.dailyPlans[state.selectedDate]) state.todo.dailyPlans[state.selectedDate] = [];
  return state.todo.dailyPlans[state.selectedDate];
}

function renderPlanList() {
  const list = currentPlanList();
  $("plan-list").innerHTML = list.map((x) => `
    <li class="task-item ${x.done?"done":""}">
      <input type="checkbox" data-plan-toggle="${x.id}" ${x.done?"checked":""} />
      <span class="text"><span class="tag ${x.color}"></span>${x.text}</span>
      <button type="button" data-plan-del="${x.id}">删除</button>
    </li>
  `).join("");
}

function dayDots(ds) {
  const list = state.todo.dailyPlans[ds] || [];
  return list.slice(0, 4).map((x) => x.color);
}

function renderCalendar() {
  const y = state.calendarYear;
  const m = state.calendarMonth;
  $("calendar-title").textContent = `${y} 年 ${m + 1} 月`;
  $("week-row").innerHTML = ["一", "二", "三", "四", "五", "六", "日"].map((d) => `<div>${d}</div>`).join("");

  const firstDay = new Date(y, m, 1);
  const start = (firstDay.getDay() + 6) % 7;
  const total = new Date(y, m + 1, 0).getDate();
  const prevTotal = new Date(y, m, 0).getDate();

  const cells = [];
  for (let i = start - 1; i >= 0; i -= 1) {
    const day = prevTotal - i;
    cells.push({ day, other: true, date: fmtDate(new Date(y, m - 1, day)) });
  }
  for (let d = 1; d <= total; d += 1) {
    cells.push({ day: d, other: false, date: fmtDate(new Date(y, m, d)) });
  }
  let n = 1;
  while (cells.length < 42) {
    cells.push({ day: n, other: true, date: fmtDate(new Date(y, m + 1, n)) });
    n += 1;
  }

  $("calendar-grid").innerHTML = cells.map((c) => {
    const dots = dayDots(c.date).map((color) => `<span class="dot ${color}"></span>`).join("");
    const active = state.selectedDate === c.date;
    return `<button type="button" class="day-cell ${c.other?"other":""} ${active?"active":""}" data-date="${c.date}">${c.day}<div class="dot-row">${dots}</div></button>`;
  }).join("");
}

function timeLeft(ms) {
  const d = ms - Date.now();
  if (d <= 0) return "已到时间";
  const s = Math.floor(d / 1000);
  const day = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${day}天 ${h}时 ${m}分 ${sec}秒`;
}

function renderMilestones() {
  state.todo.milestones.sort((a, b) => a.time - b.time);
  $("milestone-list").innerHTML = state.todo.milestones.map((x) => `
    <li class="task-item">
      <span>...</span>
      <span class="text">${x.name} | ${new Date(x.time).toLocaleString()} | ${timeLeft(x.time)}</span>
      <button type="button" data-ms-del="${x.id}">删除</button>
    </li>
  `).join("");
}

function setupTodo() {
  renderCalendar();
  renderPlanList();
  renderMilestones();

  $("prev-month").addEventListener("click", () => {
    state.calendarMonth -= 1;
    if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear -= 1; }
    renderCalendar();
  });
  $("next-month").addEventListener("click", () => {
    state.calendarMonth += 1;
    if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear += 1; }
    renderCalendar();
  });

  $("calendar-grid").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-date]");
    if (!btn) return;
    state.selectedDate = btn.dataset.date;
    $("plan-title").textContent = `日计划 (${state.selectedDate})`;
    $("back-to-month").hidden = false;
    renderCalendar();
    renderPlanList();
  });

  $("back-to-month").addEventListener("click", () => {
    state.selectedDate = "";
    $("plan-title").textContent = "月计划";
    $("back-to-month").hidden = true;
    renderCalendar();
    renderPlanList();
  });

  $("plan-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = $("plan-text").value.trim();
    const color = $("plan-color").value;
    if (!text) return;
    currentPlanList().unshift({ id: Date.now(), text, color, done: false });
    $("plan-text").value = "";
    save();
    renderPlanList();
    renderCalendar();
  });

  $("plan-list").addEventListener("click", (e) => {
    const del = e.target.closest("[data-plan-del]");
    if (del) {
      const id = Number(del.dataset.planDel);
      if (!state.selectedDate) {
        state.todo.monthPlans = state.todo.monthPlans.filter((x) => x.id !== id);
      } else {
        state.todo.dailyPlans[state.selectedDate] = currentPlanList().filter((x) => x.id !== id);
      }
      save();
      renderPlanList();
      renderCalendar();
      return;
    }
    const tog = e.target.closest("[data-plan-toggle]");
    if (tog) {
      const id = Number(tog.dataset.planToggle);
      const list = currentPlanList();
      const item = list.find((x) => x.id === id);
      if (item) item.done = !item.done;
      save();
      renderPlanList();
      renderCalendar();
    }
  });

  $("milestone-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("milestone-name").value.trim();
    const time = new Date($("milestone-time").value).getTime();
    if (!name || Number.isNaN(time)) return;
    state.todo.milestones.push({ id: Date.now(), name, time });
    $("milestone-name").value = "";
    $("milestone-time").value = "";
    save();
    renderMilestones();
  });

  $("milestone-list").addEventListener("click", (e) => {
    const del = e.target.closest("[data-ms-del]");
    if (!del) return;
    const id = Number(del.dataset.msDel);
    state.todo.milestones = state.todo.milestones.filter((x) => x.id !== id);
    save();
    renderMilestones();
  });

  setInterval(renderMilestones, 1000);
}

function setupTools() {
  $("tool-grid").innerHTML = toolLinks.map(([name, url, desc]) => `
    <article class="tool-card glass">
      <h3>${name}</h3>
      <p>${desc}</p>
      <a href="${url}" target="_blank" rel="noreferrer">打开</a>
    </article>
  `).join("");
}

function setupPlanner() {
  $("planner-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const total = Number($("total-assets").value || 0);
    const p = {
      bond: Number($("pct-bond").value || 0),
      ins: Number($("pct-ins").value || 0),
      stock: Number($("pct-stock").value || 0),
      cash: Number($("pct-cash").value || 0)
    };
    const r = {
      bond: Number($("ret-bond").value || 0) / 100,
      ins: Number($("ret-ins").value || 0) / 100,
      stock: Number($("ret-stock").value || 0) / 100,
      cash: Number($("ret-cash").value || 0) / 100
    };
    const years = Math.max(1, Math.min(30, Number($("trend-years").value || 5)));
    const sum = p.bond + p.ins + p.stock + p.cash;
    if (total <= 0) { $("planner-result").textContent = "请输入有效总资产。"; return; }
    if (sum !== 100) { $("planner-result").textContent = `占比合计 ${sum}% ，需等于 100%。`; return; }
    const m = {
      bond: total * p.bond / 100,
      ins: total * p.ins / 100,
      stock: total * p.stock / 100,
      cash: total * p.cash / 100
    };
    const trendYears = [1, 3, 5, years].filter((v, i, arr) => v <= years && arr.indexOf(v) === i).sort((a, b) => a - b);
    const fv = (principal, rate, y) => principal * ((1 + rate) ** y);
    const rows = trendYears.map((y) => {
      const bond = fv(m.bond, r.bond, y);
      const ins = fv(m.ins, r.ins, y);
      const stock = fv(m.stock, r.stock, y);
      const cash = fv(m.cash, r.cash, y);
      const totalV = bond + ins + stock + cash;
      return `
        <tr>
          <td>${y}年</td>
          <td>$${bond.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          <td>$${ins.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          <td>$${stock.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          <td>$${cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
          <td><strong>$${totalV.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></td>
        </tr>
      `;
    }).join("");

    let advice = "配置较均衡，建议定期再平衡。";
    if (p.stock >= 70) advice = "股票占比偏高，建议增加国债或现金缓冲。";
    if (p.cash >= 30) advice = "现金偏高，可分批配置低风险资产。";
    $("planner-result").innerHTML = `
      <p>国债：$${m.bond.toLocaleString()}</p>
      <p>保险：$${m.ins.toLocaleString()}</p>
      <p>股票：$${m.stock.toLocaleString()}</p>
      <p>现金：$${m.cash.toLocaleString()}</p>
      <p><strong>预计盈利趋势（按年化复利）</strong></p>
      <table class="trend-table">
        <thead>
          <tr>
            <th>年限</th>
            <th>国债</th>
            <th>保险</th>
            <th>股票</th>
            <th>现金</th>
            <th>总资产</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p><strong>建议：</strong>${advice}</p>
    `;
  });
}

function setupFortune() {
  $("draw-tarot").addEventListener("click", () => {
    const spread = tarotSpreads[Math.floor(Math.random() * tarotSpreads.length)];
    const deck = [...tarotDeck].sort(() => Math.random() - 0.5);
    const drawn = spread.positions.map((position, i) => {
      const base = deck[i];
      const reversed = Math.random() < 0.33;
      return {
        position,
        name: base.name,
        reversed,
        meaning: reversed ? base.rev : base.up
      };
    });

    $("tarot-meta").textContent = `牌阵：${spread.name}（抽取 ${spread.positions.length} 张）`;
    $("tarot-cards").innerHTML = drawn.map((card) => `
      <article class="tarot-card ${card.reversed ? "reversed" : ""}">
        <h4>${card.position}</h4>
        <div>
          <strong>${card.name}${card.reversed ? "（逆位）" : "（正位）"}</strong>
          <p>${card.meaning}</p>
        </div>
      </article>
    `).join("");

    const digest = drawn.map((card) => `${card.position}：${card.meaning}`).join("；");
    $("tarot-reading").textContent = `今日运势：${digest}`;
  });

  $("draw-fortune").addEventListener("click", () => {
    const bucket = $("fortune-bucket");
    const slip = $("fortune-slip");
    bucket.classList.remove("shake");
    slip.classList.remove("show");
    void bucket.offsetWidth;
    bucket.classList.add("shake");
    const text = fortunes[Math.floor(Math.random() * fortunes.length)];
    setTimeout(() => {
      slip.textContent = `今日签文：${text}`;
      slip.classList.add("show");
    }, 450);
  });
}

function bindGlobalEvents() {
  $("nav").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view]");
    if (!btn) return;
    setView(btn.dataset.view);
  });
  $("home-grid").addEventListener("click", (e) => {
    const card = e.target.closest("[data-jump]");
    if (!card) return;
    setView(card.dataset.jump);
  });
}

function init() {
  load();
  buildNav();
  buildHome();
  bindGlobalEvents();
  setupEarningsEvents();
  renderEarnings();
  setupTodo();
  setupTools();
  setupPlanner();
  setupFortune();
}

init();
