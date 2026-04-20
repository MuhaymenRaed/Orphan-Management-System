import { X, AlertTriangle } from "lucide-react";

export function CheckPopup({
  onClick,
  onCancel,
}: {
  onClick?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
      onClick={onCancel}
      style={{
        backgroundColor: "rgba(22, 31, 44, 0.5)",
      }}
    >
      <div
        className="rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-slideUp border"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
        style={{
          backgroundColor: "var(--fillColor)",
          borderColor: "var(--borderColor)",
        }}
      >
        {/* Header with Icon */}
        <div className="px-5 sm:px-8 pt-7 sm:pt-8 pb-5 sm:pb-6 flex flex-col items-center gap-4 relative bg-[var(--errorColor)]/20">
          <button
            onClick={onCancel}
            className="absolute left-6 top-6 transition-all hover:opacity-60"
            style={{ color: "var(--textMuted2)" }}
          >
            <X size={20} />
          </button>

          <div
            className="w-14 h-14 rounded-full flex items-center justify-center border-2"
            style={{
              borderColor: "var(--errorColor)",
            }}
          >
            <AlertTriangle size={28} style={{ color: "var(--errorColor)" }} />
          </div>
          <h2
            className="text-lg font-bold text-center"
            style={{ color: "var(--textColor)" }}
          >
            تأكيد الحذف
          </h2>
        </div>

        {/* Content */}
        <div
          className="px-5 sm:px-8 py-5 sm:py-6 border-t"
          style={{ borderColor: "var(--borderColor)" }}
        >
          <p
            className="text-center text-sm leading-relaxed"
            style={{ color: "var(--cellTextColor)" }}
          >
            هل أنت متأكد من حذف هذا العنصر؟
          </p>
          <p
            className="text-center text-xs mt-3"
            style={{ color: "var(--textMuted2)" }}
          >
            لا يمكن التراجع عن هذا الإجراء
          </p>
        </div>

        {/* Action Buttons */}
        <div
          className="px-5 sm:px-8 pb-5 sm:pb-6 pt-4 flex flex-col-reverse sm:flex-row gap-3 border-t"
          style={{ borderColor: "var(--borderColor)" }}
        >
          <button
            onClick={onCancel}
            className="flex-1 font-semibold py-3 px-6 rounded-lg border-2 transition-all"
            style={{
              borderColor: "var(--borderColor)",
              color: "var(--textColor)",
            }}
          >
            إلغاء
          </button>
          <button
            onClick={onClick}
            className="flex-1 font-semibold py-3 px-6 rounded-lg text-white transition-all"
            style={{
              backgroundColor: "var(--errorColor)",
            }}
          >
            حذف
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.93);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}
