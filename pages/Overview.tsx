import React from "react";
import { Users as UsersIcon, CreditCard, Heart, Baby } from "lucide-react";
import Card from "../components/Card";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGetOrphans } from "../utils/ReactQuerry/Orphans/useGetOrphans";
import { useSponsorStats } from "../utils/ReactQuerry/Sponsers/utils";
import { useGetSponsorships } from "../utils/ReactQuerry/Sponsorships/useGetSponsorships";
import { useGetSponsorPayments } from "../utils/ReactQuerry/SponsorPayments/useGetSponsorPayments";
import { useGetUsers } from "../utils/ReactQuerry/Users/useGetUsers";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Overview() {
  const { data: orphansData, isLoading: orphansLoading } = useGetOrphans();
  const { data: sponsorStats, isLoading: sponsorsLoading } = useSponsorStats();
  const { data: sponsorships, isLoading: sponsorshipsLoading } =
    useGetSponsorships();
  const { data: payments, isLoading: paymentsLoading } =
    useGetSponsorPayments();
  const { isLoading: usersLoading } = useGetUsers();

  // Stats
  const totalOrphans = orphansData?.orphan?.length ?? 0;
  const totalSponsors = sponsorStats?.totalSponsors ?? 0;
  const totalSponsorships = sponsorStats?.totalSponsorships ?? 0;
  const totalPayments =
    payments?.reduce((sum: any, p: any) => sum + (p.paid_amount ?? 0), 0) ?? 0;

  // Urgent cases: orphans with high priority (e.g., >= 80)
  const urgentCases = (orphansData?.orphan || []).filter(
    (o: any) => o.priority >= 80,
  );
  // Optionally, add medium priority for more cases
  const mediumCases = (orphansData?.orphan || []).filter(
    (o: any) => o.priority >= 60 && o.priority < 80,
  );

  // Priority badge helper
  const getPriorityBadge = (priority: number) => {
    if (priority >= 80) {
      return (
        <span className="bg-[var(--errorColor)]/10 text-[var(--errorColor)] px-3 py-1 rounded-full font-bold text-xs">
          عالية
        </span>
      );
    } else if (priority >= 60) {
      return (
        <span className="bg-[var(--warningColor)]/10 text-[var(--warningColor)] px-3 py-1 rounded-full font-bold text-xs">
          متوسطة
        </span>
      );
    } else {
      return (
        <span className="bg-[var(--successColor)]/10 text-[var(--successColor)] px-3 py-1 rounded-full font-bold text-xs">
          منخفضة
        </span>
      );
    }
  };

  // Pie chart: aggregate real sponsorship types
  const sponsorshipTypes = React.useMemo(() => {
    if (!sponsorships || !Array.isArray(sponsorships)) return [];
    const typeMap: Record<string, number> = {};
    sponsorships.forEach((s: any) => {
      const type = s.type || "غير محدد";
      typeMap[type] = (typeMap[type] || 0) + 1;
    });
    return Object.entries(typeMap).map(([name, value]) => ({ name, value }));
  }, [sponsorships]);

  // Bar chart: aggregate real monthly stats for sponsors and orphans
  const barData = React.useMemo(() => {
    if (!orphansData?.orphan || !Array.isArray(orphansData.orphan)) return [];
    // Get all months in the last 6 months
    const now = new Date();
    const monthsArr: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const label = d.toLocaleString("ar-EG", { month: "long" });
      monthsArr.push({ key, label });
    }
    // Count orphans per month
    const orphanCounts: Record<string, number> = {};
    orphansData.orphan.forEach((o: any) => {
      if (!o.created_at) return;
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      orphanCounts[key] = (orphanCounts[key] || 0) + 1;
    });
    // Count sponsors per month (if available)
    let sponsorCounts: Record<string, number> = {};
    if (Array.isArray((sponsorStats as any)?.sponsors)) {
      (sponsorStats as any).sponsors.forEach((s: any) => {
        if (!s.created_at) return;
        const d = new Date(s.created_at);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
        sponsorCounts[key] = (sponsorCounts[key] || 0) + 1;
      });
    }
    // Fallback: try to use sponsorStats.totalSponsors if sponsors array is not available
    // Compose bar data
    return monthsArr.map(({ key, label }) => ({
      month: label,
      الكفلاء: sponsorCounts[key] || 0,
      الأيتام: orphanCounts[key] || 0,
    }));
  }, [orphansData, sponsorStats]);

  const COLORS = ["#3b7e5c", "#6fcf97", "#b2f2bb"];

  const loading =
    orphansLoading ||
    sponsorsLoading ||
    sponsorshipsLoading ||
    paymentsLoading ||
    usersLoading;

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-6 bg-[var(--backgroundColor)] min-h-screen">
      {loading ? (
        <LoadingSpinner size="md" />
      ) : (
        <>
          {/* Summary Cards */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-auto">
            <Card>
              <div className="flex items-center gap-4 w-full">
                <span className="p-3 bg-[var(--fillColor)] rounded-xl text-[var(--primeColor)]">
                  <CreditCard size={28} />
                </span>
                <div className="flex flex-col items-end text-right gap-1">
                  <span className="text-xs text-[var(--textMuted2)]">
                    دفعات الكفلاء
                  </span>
                  <span className="text-xl font-bold text-[var(--cellTextColor)]">
                    {totalPayments.toLocaleString()} دينار عراقي
                  </span>
                  <span className="text-xs text-[var(--textMuted2)]">
                    إجمالي هذا الشهر
                  </span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-4 w-full">
                <span className="p-3 bg-[var(--fillColor)] rounded-xl text-[var(--primeColor)]">
                  <Heart size={28} />
                </span>
                <div className="flex flex-col items-end text-right gap-1">
                  <span className="text-xs text-[var(--textMuted2)]">
                    الكفالات الفعالة
                  </span>
                  <span className="text-xl font-bold text-[var(--cellTextColor)]">
                    {totalSponsorships}
                  </span>
                  <span className="text-xs text-[var(--textMuted2)]">
                    +15 هذا الشهر
                  </span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-4 w-full">
                <span className="p-3 bg-[var(--fillColor)] rounded-xl text-[var(--primeColor)]">
                  <UsersIcon size={28} />
                </span>
                <div className="flex flex-col items-end text-right gap-1">
                  <span className="text-xs text-[var(--textMuted2)]">
                    الكفلاء النشطون
                  </span>
                  <span className="text-xl font-bold text-[var(--cellTextColor)]">
                    {totalSponsors}
                  </span>
                  <span className="text-xs text-[var(--textMuted2)]">
                    +8 هذا الشهر
                  </span>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-4 w-full">
                <span className="p-3 bg-[var(--fillColor)] rounded-xl text-[var(--primeColor)]">
                  <Baby size={28} />
                </span>
                <div className="flex flex-col items-end text-right gap-1">
                  <span className="text-xs text-[var(--textMuted2)]">
                    إجمالي الأيتام
                  </span>
                  <span className="text-xl font-bold text-[var(--cellTextColor)]">
                    {totalOrphans}
                  </span>
                  <span className="text-xs text-[var(--textMuted2)]">
                    +12 هذا الشهر
                  </span>
                </div>
              </div>
            </Card>
          </ul>
          {/* Charts and more sections can be added here using recharts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-6xl mx-auto">
            <div className="bg-[var(--backgroundColor)] rounded-2xl shadow-[var(--cardShadow)] border border-[var(--borderColor)] p-5">
              <h2 className="text-sm font-bold mb-3 text-[var(--primeColor)]">
                توزيع الكفالات
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={sponsorshipTypes}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {sponsorshipTypes.map((_entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-[var(--backgroundColor)] rounded-2xl shadow-[var(--cardShadow)] border border-[var(--borderColor)] p-5">
              <h2 className="text-sm font-bold mb-3 text-[var(--primeColor)]">
                الإحصائيات الشهرية
              </h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" />
                  <Bar
                    dataKey="الكفلاء"
                    fill="#3b7e5c"
                    radius={[8, 8, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    dataKey="الأيتام"
                    fill="#6fcf97"
                    radius={[8, 8, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Urgent cases section */}
          <div className="w-full max-w-6xl mx-auto">
            <div className="bg-[var(--backgroundColor)] rounded-2xl shadow-[var(--cardShadow)] border border-[var(--borderColor)] p-5 md:p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-right text-[var(--textColor)]">
                  حالات تحتاج اهتمام عاجل
                </h2>
                <span className="bg-[var(--errorColor)]/10 text-[var(--errorColor)] p-2 rounded-xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 17c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </span>
              </div>
              {/* Urgent (high) priority cases */}
              {[...urgentCases, ...mediumCases].length === 0 ? (
                <div className="text-center text-sm text-[var(--textMuted)] py-6">
                  لا توجد حالات عاجلة حالياً
                </div>
              ) : (
                [...urgentCases, ...mediumCases].map(
                  (orphan: any, _idx: number) => (
                    <div
                      key={orphan.id}
                      className="flex flex-col sm:flex-row-reverse sm:items-center sm:justify-between gap-2 bg-[var(--fillColor)] rounded-xl p-4 border border-[var(--borderColor)]/40"
                    >
                      <div className="flex flex-row-reverse items-center justify-between sm:justify-end gap-3">
                        {getPriorityBadge(orphan.priority)}
                        <div className="flex flex-col items-end gap-0.5 text-right sm:hidden">
                          <span className="font-bold text-sm text-[var(--textColor)]">
                            {orphan.name}{" "}
                            <span className="text-[var(--textMuted)] text-xs font-normal">
                              ({orphan.age} سنة)
                            </span>
                          </span>
                          <span className="text-xs text-[var(--textMuted)]">
                            {orphan.type ||
                              orphan.description ||
                              orphan.residence ||
                              "—"}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end gap-0.5 text-right">
                        <span className="font-bold text-sm text-[var(--textColor)]">
                          {orphan.name}{" "}
                          <span className="text-[var(--textMuted)] text-xs font-normal">
                            ({orphan.age} سنة)
                          </span>
                        </span>
                        <span className="text-xs text-[var(--textMuted)]">
                          {orphan.type ||
                            orphan.description ||
                            orphan.residence ||
                            "—"}
                        </span>
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Overview;
