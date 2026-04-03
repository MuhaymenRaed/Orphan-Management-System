import { useEffect, useState } from "react";
import Button from "../components/Button";
import { MailCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get("type") === "signup") {
      setStatus("success");
    } else {
      setStatus("pending");
    }
  }, [searchParams]);

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[var(--primeColor)]/5 via-[var(--fillColor)]/40 to-[var(--backgroundColor)]"
    >
      <div className="w-full max-w-md p-7 md:p-8 space-y-6 bg-[var(--backgroundColor)] rounded-2xl shadow-[var(--cardShadow)] border border-[var(--borderColor)] animate-fadeIn">
        <div className="flex flex-col items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primeColor)]/10 mb-1">
            <MailCheck size={28} className="text-[var(--primeColor)]" />
          </span>
          {status === "success" ? (
            <>
              <h2 className="text-xl font-bold text-[var(--textColor)]">
                تم تفعيل بريدك الإلكتروني بنجاح
              </h2>
              <p className="text-xs text-[var(--textMuted)]">
                يمكنك الآن تسجيل الدخول إلى حسابك.
              </p>
            </>
          ) : (
            <h2 className="text-lg font-bold text-[var(--textColor)]">
              جاري التحقق من بريدك الإلكتروني...
            </h2>
          )}
        </div>
        <Button
          adj="w-full py-2.5 rounded-xl bg-[var(--primeColor)] text-white font-bold text-sm shadow-sm hover:shadow-md hover:brightness-105 transition-all duration-200"
          onClick={() => navigate("/signin")}
        >
          العودة لتسجيل الدخول
        </Button>
      </div>
    </div>
  );
}
