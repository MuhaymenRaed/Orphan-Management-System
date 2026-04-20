import { useEffect, useState } from "react";
import Section from "../components/Section";
import Slider from "../components/Slider";
import Toggle from "../components/Toggle";
import {
  useGetSettings,
  useUpdateSettings,
} from "../utils/ReactQuerry/Settings/useSettings";
import { useTheme } from "../utils/ThemeContext";
import { useFontSize } from "../utils/FontSizeContext";
import { Save, SendHorizonal } from "lucide-react";
import toast from "react-hot-toast";
import { sendTestEmail } from "../utils/Supabase/notifications";

function Settings() {
  const { data: settings, isLoading, isError } = useGetSettings();
  const updateSettingsMutation = useUpdateSettings();

  const { theme, setTheme } = useTheme();
  const { fontSize, setFontSize } = useFontSize();

  // Preferences
  const [showUnsponsoredFirst, setShowUnsponsoredFirst] = useState(true);
  const [prioritySort, setPrioritySort] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [newSponsorshipNotif, setNewSponsorshipNotif] = useState(true);
  const [renewalNotif, setRenewalNotif] = useState(true);
  const [urgentNotif, setUrgentNotif] = useState(true);

  // Contact
  const [email, setEmail] = useState("");

  // Priority Criteria (local only)
  const [criteria, setCriteria] = useState([
    { label: "يتم الأبوين", value: 40 },
    { label: "درجة الفقر - شديد", value: 30 },
    { label: "بدون سكن", value: 20 },
    { label: "حالة صحية تحتاج رعاية", value: 10 },
  ]);

  // Load settings from Supabase
  useEffect(() => {
    if (settings) {
      if (settings.font_size) setFontSize(settings.font_size);
      if (settings.theme_mode) {
        setTheme(settings.theme_mode);
      }
      setShowUnsponsoredFirst(settings.show_unsponsored_first ?? true);
      setPrioritySort(settings.priority_sort ?? true);
      setWeeklyReport(settings.weekly_report ?? false);
      setEmailNotif(settings.email_notif ?? true);
      setNewSponsorshipNotif(settings.new_spons_notif ?? true);
      setRenewalNotif(settings.renewal_notif ?? true);
      setUrgentNotif(settings.urgent_notif ?? true);
      setEmail(settings.email || "");
    }
  }, [settings]);

  const handleSave = () => {
    const payload = {
      id: settings?.id,
      font_size: fontSize,
      language: settings?.language || "ar",
      theme_mode: theme,
      show_unsponsored_first: showUnsponsoredFirst,
      priority_sort: prioritySort,
      weekly_report: weeklyReport,
      email_notif: emailNotif,
      new_spons_notif: newSponsorshipNotif,
      renewal_notif: renewalNotif,
      urgent_notif: urgentNotif,
      email,
    };
    console.log("Settings payload:", payload);
    console.log("Settings from DB:", settings);
    updateSettingsMutation.mutate(payload, {
      onSuccess: () => toast.success("تم حفظ الإعدادات بنجاح"),
      onError: () => toast.error("حدث خطأ أثناء حفظ الإعدادات"),
    });
  };

  const [sendingTest, setSendingTest] = useState(false);
  const handleTestEmail = async () => {
    if (!email.trim()) {
      toast.error("يرجى إدخال بريد إلكتروني أولاً");
      return;
    }
    setSendingTest(true);
    try {
      await sendTestEmail(email.trim());
      toast.success("تم إرسال بريد الاختبار بنجاح");
    } catch {
      toast.error(
        "فشل إرسال البريد — تحقق من إعداد Edge Function (send-email) في Supabase",
      );
    } finally {
      setSendingTest(false);
    }
  };

  const [tab, setTab] = useState("عام");

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--primeColor)] border-t-transparent" />
      </div>
    );
  if (isError)
    return (
      <div className="text-center py-20 text-[var(--errorColor)] text-sm">
        حدث خطأ أثناء تحميل الإعدادات
      </div>
    );

  return (
    <div
      dir="rtl"
      className="w-full min-h-screen bg-[var(--backgroundColor)] text-[var(--textColor)] px-4 md:px-8 py-4 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex flex-col items-start">
          <h1 className="text-xl md:text-2xl font-bold text-[var(--textColor)]">
            الإعدادات
          </h1>
          <p className="text-xs text-[var(--textMuted)] mt-1">
            إدارة إعدادات النظام والتفضيلات
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={updateSettingsMutation.isPending}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[var(--primeColor)] text-white font-bold text-sm shadow-sm hover:shadow-md hover:brightness-105 transition-all disabled:opacity-50 cursor-pointer"
        >
          <Save size={16} />
          {updateSettingsMutation.isPending ? "جاري الحفظ..." : "حفظ"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 w-full max-w-5xl mx-auto overflow-x-auto">
        {["عام", "الإشعارات", "الأولوية"].map((t) => (
          <button
            key={t}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
              tab === t
                ? "bg-[var(--primeColor)] text-white shadow-sm"
                : "bg-[var(--fillColor)] text-[var(--textColor)] hover:bg-[var(--borderColor)]"
            }`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="w-full max-w-5xl mx-auto">
        {/* General Tab */}
        {tab === "عام" && (
          <>
            <Section title="المظهر">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col gap-2 items-end flex-1">
                  <span className="text-xs font-bold text-[var(--subTextColor)]">
                    وضع المظهر
                  </span>
                  <div className="flex gap-2 w-full justify-end">
                    {[
                      { label: "فاتح", value: "light" },
                      { label: "داكن", value: "dark" },
                      { label: "النظام", value: "system" },
                    ].map((m) => (
                      <button
                        key={m.value}
                        className={`flex-1 max-w-[120px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          theme === m.value
                            ? "bg-[var(--primeColor)] text-white"
                            : "bg-[var(--fillColor)] text-[var(--textColor)] hover:bg-[var(--borderColor)]"
                        }`}
                        onClick={() => setTheme(m.value as any)}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end flex-1">
                  <span className="text-xs font-bold text-[var(--subTextColor)]">
                    حجم الخط
                  </span>
                  <div className="flex gap-2 w-full justify-end">
                    {[
                      { label: "صغير", value: "small" },
                      { label: "متوسط", value: "medium" },
                      { label: "كبير", value: "large" },
                    ].map((fs) => (
                      <button
                        key={fs.value}
                        className={`flex-1 max-w-[100px] px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          fontSize === fs.value
                            ? "bg-[var(--primeColor)] text-white"
                            : "bg-[var(--fillColor)] text-[var(--textColor)] hover:bg-[var(--borderColor)]"
                        }`}
                        onClick={() => setFontSize(fs.value)}
                      >
                        {fs.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Section>

            <Section title="التفضيلات">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Toggle
                    checked={showUnsponsoredFirst}
                    onChange={setShowUnsponsoredFirst}
                  />
                  <span className="text-sm text-[var(--textColor)]">
                    عرض غير المكفولين أولاً
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <Toggle checked={prioritySort} onChange={setPrioritySort} />
                  <span className="text-sm text-[var(--textColor)]">
                    ترتيب حسب الأولوية
                  </span>
                </div>
              </div>
            </Section>

            <Section title="البريد الإلكتروني">
              <div className="flex flex-col gap-3 items-end">
                <span className="text-xs font-bold text-[var(--subTextColor)]">
                  عنوان البريد الإلكتروني للإشعارات
                </span>
                <input
                  className="w-full max-w-md rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] px-3.5 py-2.5 text-sm text-[var(--textColor)] focus:outline-none focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@charity.org"
                  dir="ltr"
                />
                <button
                  onClick={handleTestEmail}
                  disabled={sendingTest || !email.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--primeColor)] text-[var(--primeColor)] text-xs font-bold hover:bg-[var(--primeColor)]/10 transition-all disabled:opacity-40 cursor-pointer"
                >
                  <SendHorizonal size={14} />
                  {sendingTest ? "جاري الإرسال..." : "إرسال بريد اختبار"}
                </button>
              </div>
            </Section>
          </>
        )}

        {/* Notifications Tab */}
        {tab === "الإشعارات" && (
          <Section title="إعدادات الإشعارات">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Toggle checked={emailNotif} onChange={setEmailNotif} />
                <span className="text-sm text-[var(--textColor)]">
                  إشعارات البريد الإلكتروني
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Toggle
                  checked={newSponsorshipNotif}
                  onChange={setNewSponsorshipNotif}
                />
                <span className="text-sm text-[var(--textColor)]">
                  إشعارات الكفالات الجديدة
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Toggle checked={renewalNotif} onChange={setRenewalNotif} />
                <span className="text-sm text-[var(--textColor)]">
                  إشعارات التجديد
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Toggle checked={urgentNotif} onChange={setUrgentNotif} />
                <span className="text-sm text-[var(--textColor)]">
                  تنبيهات الحالات العاجلة
                </span>
              </div>
              <div className="flex items-center justify-between">
                <Toggle checked={weeklyReport} onChange={setWeeklyReport} />
                <span className="text-sm text-[var(--textColor)]">
                  تقرير أسبوعي
                </span>
              </div>
            </div>
          </Section>
        )}

        {/* Priority Tab */}
        {tab === "الأولوية" && (
          <Section title="معايير تصنيف الأولوية">
            <p className="text-xs text-[var(--textMuted)] mb-4 text-right">
              تخصيص نقاط الأولوية للمعايير المختلفة
            </p>
            <div className="flex flex-col gap-5">
              {criteria.map((c, i) => (
                <div
                  key={c.label}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full"
                >
                  <div className="flex items-center justify-between sm:justify-start gap-2">
                    <span className="w-auto sm:w-36 text-right text-sm shrink-0">
                      {c.label}
                    </span>
                    <span className="sm:hidden text-xs font-bold text-[var(--primeColor)]">
                      {c.value} نقطة
                    </span>
                  </div>
                  <Slider
                    value={c.value}
                    min={0}
                    max={50}
                    step={1}
                    onChange={(v) => {
                      const newCriteria = [...criteria];
                      newCriteria[i] = { ...newCriteria[i], value: v };
                      setCriteria(newCriteria);
                    }}
                    className="flex-1"
                  />
                  <span className="hidden sm:block w-16 text-left text-xs font-bold text-[var(--primeColor)]">
                    {c.value} نقطة
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <button
                className="px-5 py-2 rounded-xl border border-[var(--borderColor)] text-sm font-bold text-[var(--textColor)] hover:bg-[var(--fillColor)] transition-colors cursor-pointer"
                onClick={() =>
                  setCriteria([
                    { label: "يتم الأبوين", value: 40 },
                    { label: "درجة الفقر - شديد", value: 30 },
                    { label: "بدون سكن", value: 20 },
                    { label: "حالة صحية تحتاج رعاية", value: 10 },
                  ])
                }
              >
                إعادة تعيين
              </button>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

export default Settings;
