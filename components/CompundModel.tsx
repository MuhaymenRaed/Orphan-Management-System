import { type ReactNode, createContext, useContext } from "react";
import {
  useForm,
  type UseFormReturn,
  type FieldValues,
  type DefaultValues,
} from "react-hook-form";

interface ModalContextType<T extends FieldValues = any> {
  form: UseFormReturn<T>;
  isPending: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  editId?: string | number | null;
}

const ModalContext = createContext<ModalContextType<any> | undefined>(
  undefined,
);

function useModalContext<T extends FieldValues>() {
  const context = useContext(ModalContext);
  if (!context)
    throw new Error("Modal components must be used within Modal.Root");
  return context as ModalContextType<T>;
}

interface RootProps<T extends FieldValues> {
  children: ReactNode;
  onClose: () => void;
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  isPending?: boolean;
  mode?: "create" | "edit";
  editId?: string | number | null;
}

const Root = <T extends FieldValues>({
  children,
  onClose,
  onSubmit,
  defaultValues,
  isPending = false,
  mode = "create",
  editId = null,
}: RootProps<T>) => {
  const form = useForm<T>({ defaultValues, mode: "onChange" });

  return (
    <ModalContext.Provider value={{ form, isPending, onClose, mode, editId }}>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4 animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="bg-[var(--backgroundColor)] rounded-t-2xl md:rounded-2xl w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp border border-[var(--borderColor)]"
          onClick={(e) => e.stopPropagation()}
          dir="rtl"
        >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col"
          >
            {children}
          </form>
        </div>
      </div>
    </ModalContext.Provider>
  );
};

const Header = ({
  title,
  editTitle,
}: {
  title: string;
  editTitle?: string;
}) => {
  const { onClose, mode } = useModalContext();
  return (
    <div className="flex items-center justify-between p-5 md:p-6 border-b border-[var(--borderColor)] sticky top-0 bg-[var(--backgroundColor)] z-10">
      <h2 className="text-lg font-bold text-[var(--textColor)]">
        {mode === "edit" && editTitle ? editTitle : title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--fillColor)] text-[var(--textMuted)] hover:text-[var(--textColor)] transition-all text-lg"
      >
        ×
      </button>
    </div>
  );
};

const Body = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`p-5 md:p-6 ${className}`}>{children}</div>;

const Grid = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
    {children}
  </div>
);

const Input = <T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  validation,
  span = 1,
}: {
  name: keyof T;
  label: string;
  type?: string;
  placeholder?: string;
  validation?: object;
  span?: 1 | 2;
}) => {
  const { form } = useModalContext<T>();
  const error = form.formState.errors[name];

  return (
    <div
      className={`${span === 2 ? "col-span-1 md:col-span-2" : "col-span-1"}`}
    >
      <label className="block text-xs font-bold text-[var(--subTextColor)] mb-1.5 mr-0.5">
        {label}
      </label>
      <input
        type={type}
        {...form.register(name as any, validation)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 bg-[var(--fillColor)] border ${
          error
            ? "border-[var(--errorColor)] ring-1 ring-[var(--errorColor)]/30"
            : "border-[var(--borderColor)]"
        } rounded-xl focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 outline-none transition-all duration-200 text-sm text-[var(--textColor)] placeholder:text-[var(--textMuted)]`}
      />
      {error && (
        <p className="text-[var(--errorColor)] text-[10px] mt-1 mr-0.5">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

const Select = <T extends FieldValues>({
  name,
  label,
  options,
  placeholder,
  validation,
  span = 1,
}: {
  name: keyof T;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  validation?: object;
  span?: 1 | 2;
}) => {
  const { form } = useModalContext<T>();
  const error = form.formState.errors[name];

  return (
    <div
      className={`${span === 2 ? "col-span-1 md:col-span-2" : "col-span-1"}`}
    >
      <label className="block text-xs font-bold text-[var(--subTextColor)] mb-1.5 mr-0.5">
        {label}
      </label>
      <select
        {...form.register(name as any, validation)}
        className={`w-full px-3.5 py-2.5 bg-[var(--fillColor)] border ${
          error
            ? "border-[var(--errorColor)] ring-1 ring-[var(--errorColor)]/30"
            : "border-[var(--borderColor)]"
        } rounded-xl focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 outline-none transition-all duration-200 text-sm text-[var(--textColor)]`}
      >
        <option value="">{placeholder || "اختر..."}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-[var(--errorColor)] text-[10px] mt-1 mr-0.5">
          {error.message as string}
        </p>
      )}
    </div>
  );
};

const Footer = ({
  submitText = "حفظ",
  loadingText = "جاري الحفظ...",
}: {
  submitText?: string;
  loadingText?: string;
}) => {
  const { isPending, onClose, mode } = useModalContext();
  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 p-5 md:p-6 border-t border-[var(--borderColor)] mt-4 bg-[var(--fillColor)]/30">
      <button
        type="button"
        onClick={onClose}
        className="flex-1 md:flex-none px-6 py-2.5 rounded-xl border border-[var(--borderColor)] text-[var(--textColor)] font-medium text-sm hover:bg-[var(--fillColor)] transition-colors disabled:opacity-50"
        disabled={isPending}
      >
        إلغاء
      </button>
      <button
        type="submit"
        className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-[var(--primeColor)] text-white font-bold text-sm shadow-sm hover:shadow-md hover:brightness-105 disabled:opacity-50 transition-all duration-200"
        disabled={isPending}
      >
        {isPending ? loadingText : mode === "edit" ? "تحديث" : submitText}
      </button>
    </div>
  );
};

export const Modal = {
  Root,
  Header,
  Body,
  Grid,
  Input,
  Footer,
  Select,
  useContext: useModalContext,
};
