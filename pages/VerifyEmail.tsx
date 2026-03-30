import React, { useEffect, useState } from "react";
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
    <div dir="rtl" className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-(--primeColor)/10 via-(--fillColor)/60 to-(--backgroundColor)">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/90 dark:bg-(--backgroundColor)/90 rounded-3xl shadow-2xl border border-(--borderColor) backdrop-blur-lg">
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-tr from-(--primeColor)/80 to-(--fillColor)/80 shadow-lg mb-2">
            <MailCheck size={32} className="text-white drop-shadow" />
          </span>
          {status === "success" ? (
            <>
              <h2 className="text-2xl font-extrabold text-center text-(--primeColor) tracking-tight mb-2">
                تم تفعيل بريدك الإلكتروني بنجاح
              </h2>
              <p className="text-sm text-center text-(--textMuted)">
                يمكنك الآن تسجيل الدخول إلى حسابك.
              </p>
            </>
          ) : (
            <h2 className="text-xl text-center text-(--primeColor)">
              جاري التحقق من بريدك الإلكتروني...
            </h2>
          )}
        </div>
        <Button
          adj="w-full py-3 rounded-xl bg-gradient-to-tr from-[var(--primeColor)] to-emerald-400 text-white font-bold text-lg shadow-lg hover:brightness-110 transition-all"
          onClick={() => navigate("/signin")}
        >
          العودة لتسجيل الدخول
        </Button>
      </div>
    </div>
  );
}
