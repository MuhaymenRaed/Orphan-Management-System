import { useEffect, useState } from "react";
import Section from "../components/Section";
import Select from "../components/Select";
import Slider from "../components/Slider";
import Toggle from "../components/Toggle";
import {
  useGetSettings,
  useUpdateSettings,
} from "../utils/ReactQuerry/Settings/useSettings";
import { useTheme } from "../utils/ThemeContext";

const fontSizes = [
  { label: "صغير", value: "small" },

  { label: "كبير", value: "large" },
];
const languages = [
  { label: "العربية", value: "ar" },
  { label: "English", value: "en" },
  <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between mb-2">
    <div className="flex flex-col items-end">
      <h1 className="text-2xl md:text-3xl font-bold mb-1 text-[var(--primeColor)]">
        الإعدادات
      </h1>
      <span className="text-[var(--textMuted2)] text-sm">
        إدارة إعدادات النظام والتفضيلات
      </span>
    </div>
  </div>,
];
const themeModes = [
  { label: "النظام", value: "system" },
  { label: "فاتح", value: "light" },
  { label: "داكن", value: "dark" },
];

function Settings() {
  // Supabase settings integration
  const { data: settings, isLoading, isError } = useGetSettings();
  const updateSettingsMutation = useUpdateSettings();

  // General
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [fontSize, setFontSize] = useState("medium");
  const [language, setLanguage] = useState("ar");
  const [darkAuto, setDarkAuto] = useState(theme === "system");

  // Preferences
  const [showUnsponsoredFirst, setShowUnsponsoredFirst] = useState(true);
  const [prioritySort, setPrioritySort] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [newSponsorshipNotif, setNewSponsorshipNotif] = useState(true);
  const [renewalNotif, setRenewalNotif] = useState(true);
  const [urgentNotif, setUrgentNotif] = useState(true);

  // Notification Channels
  const [email, setEmail] = useState("admin@charity.org");
  const [phone, setPhone] = useState("0551234567");

  // Organization Info
  const [orgName, setOrgName] = useState("المؤسسة الخيرية لرعاية الأيتام");
  const [orgEmail, setOrgEmail] = useState("info@charity.org");
  const [orgAddress, setOrgAddress] = useState(
    "الرياض، المملكة العربية السعودية",
  );
  const [orgLicense, setOrgLicense] = useState("123456");
  const [orgMobile, setOrgMobile] = useState("0551234567");

  // Priority Criteria
  const [criteria, setCriteria] = useState([
    { label: "يتم الأبوين", value: 40 },
    { label: "درجة الفقر - شديد", value: 30 },
    { label: "بدون سكن", value: 20 },
    { label: "حالة صحية تحتاج رعاية", value: 10 },
  ]);

  // Passwords
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Backup
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFreq, setBackupFreq] = useState("يومي");
  const [backups, setBackups] = useState([
    { date: "2024-10-06", time: "10:30", label: "آخر نسخة احتياطية" },
    { date: "2024-10-05", time: "11:00", label: "نسخة احتياطية" },
    { date: "2024-10-04", time: "11:00", label: "نسخة احتياطية" },
  ]);

  // Security
  const [twoFactor, setTwoFactor] = useState(true);
  const [autoLogout, setAutoLogout] = useState(true);
  const [logAll, setLogAll] = useState(false);

  // Load settings from Supabase on mount
  useEffect(() => {
    if (settings) {
      setFontSize(settings.fontSize || "medium");
      setLanguage(settings.language || "ar");
      setDarkAuto(settings.theme === "system");
      setShowUnsponsoredFirst(settings.showUnsponsoredFirst ?? true);
      setPrioritySort(settings.prioritySort ?? true);
      setWeeklyReport(settings.weeklyReport ?? false);
      setEmailNotif(settings.emailNotif ?? true);
      setNewSponsorshipNotif(settings.newSponsorshipNotif ?? true);
      setRenewalNotif(settings.renewalNotif ?? true);
      setUrgentNotif(settings.urgentNotif ?? true);
      setEmail(settings.email || "admin@charity.org");
      setPhone(settings.phone || "0551234567");
      setOrgName(settings.orgName || "المؤسسة الخيرية لرعاية الأيتام");
      setOrgEmail(settings.orgEmail || "info@charity.org");
      setOrgAddress(settings.orgAddress || "الرياض، المملكة العربية السعودية");
      setOrgLicense(settings.orgLicense || "123456");
      setOrgMobile(settings.orgMobile || "0551234567");
      setCriteria(
        settings.criteria || [
          { label: "يتم الأبوين", value: 40 },
          { label: "درجة الفقر - شديد", value: 30 },
          { label: "بدون سكن", value: 20 },
          { label: "حالة صحية تحتاج رعاية", value: 10 },
        ],
      );
      setAutoBackup(settings.autoBackup ?? true);
      setBackupFreq(settings.backupFreq || "يومي");
      setBackups(
        settings.backups || [
          { date: "2024-10-06", time: "10:30", label: "آخر نسخة احتياطية" },
          { date: "2024-10-05", time: "11:00", label: "نسخة احتياطية" },
          { date: "2024-10-04", time: "11:00", label: "نسخة احتياطية" },
        ],
      );
      setTwoFactor(settings.twoFactor ?? true);
      setAutoLogout(settings.autoLogout ?? true);
      setLogAll(settings.logAll ?? false);
    }
  }, [settings]);

  // Save handler
  const handleSave = () => {
    const newSettings = {
      id: settings?.id || 1,
      fontSize,
      language,
      theme: darkAuto ? "system" : resolvedTheme === "dark" ? "dark" : "light",
      showUnsponsoredFirst,
      prioritySort,
      weeklyReport,
      emailNotif,
      newSponsorshipNotif,
      renewalNotif,
      urgentNotif,
      email,
      phone,
      orgName,
      orgEmail,
      orgAddress,
      orgLicense,
      orgMobile,
      criteria,
      autoBackup,
      backupFreq,
      backups,
      twoFactor,
      autoLogout,
      logAll,
    };
    updateSettingsMutation.mutate(newSettings);
  };

  // Handlers
  const handleThemeToggle = (checked: boolean) => {
    setDarkAuto(checked);
    setTheme(checked ? "system" : resolvedTheme === "dark" ? "dark" : "light");
  };

  // Responsive tab state
  const [tab, setTab] = useState("عام");
  const [subTab, setSubTab] = useState("الإشعارات");

  if (isLoading)
    return <div className="text-center py-20">جاري تحميل الإعدادات...</div>;
  if (isError)
    return (
      <div className="text-center py-20 text-[var(--errorColor)]">
        حدث خطأ أثناء تحميل الإعدادات
      </div>
    );

  return (
    <div className="w-full min-h-screen bg-[var(--backgroundColor)] text-[var(--textColor)] px-2 md:px-8 py-4 flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex flex-row-reverse gap-2 md:gap-4 w-full max-w-6xl mx-auto mt-2 mb-4">
        {["عام", "المؤسسة", "الإشعارات", "الأمان", "النسخ الاحتياطي"].map(
          (t) => (
            <button
              key={t}
              className={`flex-1 py-2 rounded-full text-center font-bold transition-all duration-200 ${tab === t ? "bg-[var(--primeColor)] text-white" : "bg-[var(--fillColor)] text-[var(--primeColor)]"}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ),
        )}
      </div>

      {/* General Tab */}
      {tab === "عام" && (
        <>
          <Section title="المظهر">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full">
              {/* Theme Toggle */}
              <div className="flex flex-col gap-2 items-end w-full md:w-1/2">
                <span className="font-bold">تخصيص مظهر النظام</span>
                <div className="flex items-center gap-2 w-full justify-end">
                  <button
                    className={`px-4 py-2 rounded-lg font-bold transition-all duration-200 w-32 ${theme === "dark" ? "bg-[var(--primeColor)] text-white" : "bg-[var(--fillColor)] text-[var(--primeColor)]"}`}
                    onClick={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  >
                    {theme === "dark" ? "الوضع الداكن" : "الوضع الفاتح"}
                  </button>
                  <span className="text-xs text-[var(--textMuted2)]">
                    تفعيل الوضع الداكن لتقليل إجهاد العين
                  </span>
                </div>
              </div>
              {/* Font Size Selector */}
              <div className="flex flex-col gap-2 items-end w-full md:w-1/2">
                <span className="font-bold">حجم الخط</span>
                <div className="flex flex-row-reverse gap-2 w-full">
                  {[
                    { label: "صغير", value: "small" },
                    { label: "متوسط", value: "medium" },
                    { label: "كبير", value: "large" },
                  ].map((fs) => (
                    <button
                      key={fs.value}
                      className={`flex-1 px-4 py-2 rounded-lg font-bold transition-all duration-200 w-24 ${fontSize === fs.value ? "bg-[var(--primeColor)] text-white" : "bg-[var(--fillColor)] text-[var(--primeColor)]"}`}
                      onClick={() => setFontSize(fs.value)}
                    >
                      {fs.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Priority Criteria Sliders - full width box (only in first tab) */}
          <div className="w-full max-w-4xl mx-auto bg-[var(--backgroundColor)] border border-[var(--borderColor)] rounded-2xl p-4 mt-4 flex flex-col items-center shadow-lg">
            <h2 className="text-lg font-bold mb-2 text-(--primeColor) text-center">
              معايير تصنيف الأولوية
            </h2>
            <span className="text-(--textMuted2) text-sm mb-4 text-center">
              تخصيص نقاط الأولوية للمعايير المختلفة
            </span>
            <div className="w-full flex flex-col gap-4">
              {criteria.map((c, i) => (
                <div
                  key={c.label}
                  className="flex items-center gap-2 w-full flex-col xs:flex-row"
                >
                  <span className="w-full xs:w-40 text-right mb-2 xs:mb-0">
                    {c.label}
                  </span>
                  <Slider
                    value={c.value}
                    min={0}
                    max={50}
                    step={1}
                    onChange={(v) => {
                      const newCriteria = [...criteria];
                      newCriteria[i].value = v;
                      setCriteria(newCriteria);
                    }}
                    className="flex-1"
                  />
                  <span className="w-12 text-left">{c.value} نقطة</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col xs:flex-row gap-2 mt-6 w-full justify-center items-center">
              <button
                className="bg-[var(--primeColor)] text-white px-6 py-2 rounded-lg font-bold w-full xs:w-auto"
                onClick={handleSave}
              >
                حفظ المعايير
              </button>
              <button
                className="border border-[var(--primeColor)] text-[var(--primeColor)] px-6 py-2 rounded-lg font-bold w-full xs:w-auto"
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
          </div>
        </>
      )}

      {/* Organization Tab */}
      {tab === "المؤسسة" && (
        <Section title="معلومات المؤسسة">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 items-end">
              <span className="text-[var(--textMuted2)]">اسم المؤسسة</span>
              <input
                className="rounded-lg border border-[var(--borderColor)] bg-[var(--backgroundColor)] px-4 py-2 text-[var(--textColor)]"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className="text-[var(--textMuted2)]">
                البريد الإلكتروني
              </span>
              <input
                className="rounded-lg border border-[var(--borderColor)] bg-[var(--backgroundColor)] px-4 py-2 text-[var(--textColor)]"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className="text-[var(--textMuted2)]">العنوان</span>
              <input
                className="rounded-lg border border-[var(--borderColor)] bg-[var(--backgroundColor)] px-4 py-2 text-[var(--textColor)]"
                value={orgAddress}
                onChange={(e) => setOrgAddress(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className="text-[var(--textMuted2)]">رقم الترخيص</span>
              <input
                className="rounded-lg border border-[var(--borderColor)] bg-[var(--backgroundColor)] px-4 py-2 text-[var(--textColor)]"
                value={orgLicense}
                onChange={(e) => setOrgLicense(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span className="text-[var(--textMuted2)]">رقم الجوال</span>
              <input
                className="rounded-lg border border-[var(--borderColor)] bg-[var(--backgroundColor)] px-4 py-2 text-[var(--textColor)]"
                value={orgMobile}
                onChange={(e) => setOrgMobile(e.target.value)}
              />
            </div>
          </div>
        </Section>
      )}

      {/* Notification Tab */}
      {tab === "الإشعارات" && (
        <>
          <Section title="إعدادات الإشعارات">
            <div className="flex flex-col gap-4">
              <Toggle
                checked={emailNotif}
                onChange={setEmailNotif}
                label="إشعارات البريد الإلكتروني"
              />
              <Toggle
                checked={newSponsorshipNotif}
                onChange={setNewSponsorshipNotif}
                label="إشعارات الكفالات الجديدة"
              />
              <Toggle
                checked={renewalNotif}
                onChange={setRenewalNotif}
                label="إشعارات التجديد"
              />
              <Toggle
                checked={urgentNotif}
                onChange={setUrgentNotif}
                label="تنبيهات الحالات العاجلة"
              />
              <Toggle
                checked={weeklyReport}
                onChange={setWeeklyReport}
                label="تقرير أسبوعي"
              />
            </div>
          </Section>
          <Section title="قنوات الإشعارات">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 items-end">
                <span className="text-[var(--textMuted2)]">
                  البريد الإلكتروني
                </span>
                <input
                  className="rounded-lg border border-[var(--borderColor)] bg-[var(--backgroundColor)] px-4 py-2 text-[var(--textColor)]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className="text-[var(--textMuted2)]">
                  رقم الجوال (SMS)
                </span>
                <input
                  className="rounded-lg border border-[var(--borderColor)] bg-[var(--backgroundColor)] px-4 py-2 text-[var(--textColor)]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </Section>
        </>
      )}

      {/* Security Tab */}
      {tab === "الأمان" && (
        <>
          <Section title="الأمان وكلمة المرور">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2 items-end">
                <span className="text-[var(--textMuted2)]">
                  كلمة المرور الحالية
                </span>
                <input
                  type="password"
                  className="rounded-lg border border-[var(--borderColor)] bg-[var(--backgroundColor)] px-4 py-2 text-[var(--textColor)]"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className="text-[var(--textMuted2)]">
                  كلمة المرور الجديدة
                </span>
                <input
                  type="password"
                  className="rounded-lg border border-[var(--borderColor)] bg-[var(--backgroundColor)] px-4 py-2 text-[var(--textColor)]"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className="text-[var(--textMuted2)]">
                  تأكيد كلمة المرور
                </span>
                <input
                  type="password"
                  className="rounded-lg border border-[var(--borderColor)] bg-[var(--backgroundColor)] px-4 py-2 text-[var(--textColor)]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4 justify-end">
              <button className="bg-[var(--primeColor)] text-white px-6 py-2 rounded-lg font-bold">
                تحديث كلمة المرور
              </button>
            </div>
          </Section>
          <Section title="خيارات الأمان المتقدمة">
            <div className="flex flex-col gap-4">
              <Toggle
                checked={twoFactor}
                onChange={setTwoFactor}
                label="المصادقة الثنائية"
              />
              <Toggle
                checked={autoLogout}
                onChange={setAutoLogout}
                label="تسجيل الخروج التلقائي"
              />
              <Toggle
                checked={logAll}
                onChange={setLogAll}
                label="سجل العمليات"
              />
            </div>
          </Section>
        </>
      )}

      {/* Backup Tab */}
      {tab === "النسخ الاحتياطي" && (
        <>
          <Section title="النسخ الاحتياطي">
            <div className="flex flex-col gap-4">
              <Toggle
                checked={autoBackup}
                onChange={setAutoBackup}
                label="النسخ الاحتياطي التلقائي"
              />
              <div className="flex flex-col gap-2 items-end">
                <span className="text-[var(--textMuted2)]">
                  تكرار النسخ الاحتياطي
                </span>
                <Select
                  value={backupFreq}
                  onChange={setBackupFreq}
                  options={[
                    { label: "يومي", value: "يومي" },
                    { label: "أسبوعي", value: "أسبوعي" },
                  ]}
                />
              </div>
              <div className="flex flex-col gap-2 items-end">
                {backups.map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 w-full justify-between bg-[var(--fillColor)] rounded-lg px-4 py-2"
                  >
                    <span className="text-[var(--textMuted2)]">
                      {b.label} - {b.date} {b.time}
                    </span>
                    <button className="bg-[var(--primeColor)] text-white px-4 py-1 rounded-lg">
                      تحميل
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2 justify-end">
                <button className="bg-[var(--primeColor)] text-white px-6 py-2 rounded-lg">
                  إنشاء نسخة جديدة
                </button>
                <button className="border border-[var(--primeColor)] text-[var(--primeColor)] px-6 py-2 rounded-lg">
                  استيراد نسخة
                </button>
              </div>
            </div>
          </Section>
        </>
      )}
    </div>
  );
}

export default Settings;
