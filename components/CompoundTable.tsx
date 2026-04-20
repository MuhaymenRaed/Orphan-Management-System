import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Search, X, Filter, Check, ChevronDown } from "lucide-react";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

interface DataTableContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  deleteConfirm: string | number | null;
  setDeleteConfirm: (id: string | number | null) => void;
  editItem: any | null;
  setEditItem: (item: any | null) => void;
}

const DataTableContext = createContext<DataTableContextType | undefined>(
  undefined,
);

const useDataTableContext = () => {
  const context = useContext(DataTableContext);
  if (!context)
    throw new Error("DataTable components must be used within DataTable.Root");
  return context;
};

interface RootProps {
  children: ReactNode;
  dir?: "rtl" | "ltr";
  className?: string;
}
interface HeaderProps {
  children: ReactNode;
  className?: string;
}
interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}
interface FilterOption {
  label: string;
  value: string;
}
interface FilterProps {
  label?: string;
  options: FilterOption[];
  onChange?: (value: string) => void;
  className?: string;
}
interface AddButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}
interface TableProps {
  children: ReactNode;
  className?: string;
}
interface TableBodyProps<T> {
  data: T[];
  renderRow: (item: T, index: number) => ReactNode;
  emptyMessage?: string;
}
interface TableCellProps {
  children: ReactNode;
  className?: string;
}

const Root = ({ children, dir = "rtl", className = "" }: RootProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(
    null,
  );
  const [editItem, setEditItem] = useState<any | null>(null);

  return (
    <DataTableContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        filterValue,
        setFilterValue,
        isModalOpen,
        setIsModalOpen,
        deleteConfirm,
        setDeleteConfirm,
        editItem,
        setEditItem,
      }}
    >
      <div
        dir={dir}
        className={`w-full rounded-2xl border border-[var(--borderColor)] bg-[var(--backgroundColor)] p-4 md:p-6 shadow-[var(--cardShadow)] animate-fadeIn ${className}`}
      >
        {children}
      </div>
    </DataTableContext.Provider>
  );
};

const Header = ({ children, className = "" }: HeaderProps) => (
  <div
    className={`mb-5 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between ${className}`}
  >
    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
      {children}
    </div>
  </div>
);

const FilterSelect = ({
  label = "تصفية",
  options,
  onChange,
  className = "",
}: FilterProps) => {
  const { filterValue, setFilterValue } = useDataTableContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    setFilterValue(val);
    onChange?.(val);
    setIsOpen(false);
  };

  const currentLabel =
    options.find((o) => o.value === filterValue)?.label || label;

  return (
    <div ref={containerRef} className={`relative min-w-[140px] ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] px-3.5 py-2.5 md:py-2 text-sm text-[var(--textColor)] hover:border-[var(--primeColor)]/50 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-[var(--textMuted)]" />
          <span className="text-xs">
            {filterValue === "all" ? label : currentLabel}
          </span>
        </div>
        <ChevronDown
          size={13}
          className={`transition-transform duration-200 text-[var(--textMuted)] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1.5 z-50 w-full min-w-[170px] rounded-xl border border-[var(--borderColor)] bg-[var(--backgroundColor)] shadow-lg p-1 animate-scaleIn">
          <button
            onClick={() => handleSelect("all")}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
              filterValue === "all"
                ? "bg-[var(--primeColor)]/10 text-[var(--primeColor)] font-bold"
                : "hover:bg-[var(--fillColor)] text-[var(--textColor)]"
            }`}
          >
            <span>الكل</span>
            {filterValue === "all" && <Check size={13} />}
          </button>
          <div className="my-1 h-px bg-[var(--borderColor)]/50" />
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                filterValue === option.value
                  ? "bg-[var(--primeColor)]/10 text-[var(--primeColor)] font-bold"
                  : "hover:bg-[var(--fillColor)] text-[var(--textColor)]"
              }`}
            >
              <span>{option.label}</span>
              {filterValue === option.value && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const SearchInput = ({
  placeholder = "البحث...",
  onSearch,
  className = "",
}: SearchProps) => {
  const { searchQuery, setSearchQuery } = useDataTableContext();
  const handleX = () => {
    setSearchQuery("");
    onSearch?.("");
  };

  return (
    <div className={`relative w-full md:max-w-sm ${className}`}>
      <Search
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--textMuted)]"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onSearch?.(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] px-9 py-2.5 md:py-2 text-xs text-[var(--textColor)] outline-none focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 transition-all duration-200 placeholder:text-[var(--textMuted)]"
      />
      {searchQuery && (
        <button
          onClick={handleX}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--textMuted)] hover:text-[var(--errorColor)] transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

const AddButton = ({ label, onClick, className = "" }: AddButtonProps) => {
  const { setIsModalOpen, setEditItem } = useDataTableContext();
  return (
    <Button
      adj={`md:mr-auto inline-flex items-center gap-2 rounded-xl bg-[var(--primeColor)] px-5 py-2.5 md:py-2 text-white shadow-sm hover:shadow-md hover:brightness-105 transition-all duration-200 whitespace-nowrap ${className}`}
      onClick={() => {
        setEditItem(null);
        setIsModalOpen(true);
        onClick?.();
      }}
    >
      <span className="font-bold text-xs">إضافة {label}</span>
    </Button>
  );
};

const Table = ({ children, className = "" }: TableProps) => (
  <div className="w-full overflow-x-auto rounded-xl border border-[var(--borderColor)]/50 custom-scrollbar">
    <table className={`min-w-full text-sm text-right ${className}`}>
      {children}
    </table>
  </div>
);

const ResultsCount = ({ count, total }: { count: number; total: number }) => (
  <div className="mt-4 text-xs text-[var(--textMuted)] text-right">
    عرض <span className="font-bold text-[var(--textColor)]">{count}</span> من{" "}
    <span className="font-bold text-[var(--textColor)]">{total}</span>
  </div>
);

const Loading = () => (
  <div className="flex justify-center items-center py-16">
    <LoadingSpinner />
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center py-16">
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[var(--errorColor)]/10 flex items-center justify-center">
        <X size={20} className="text-[var(--errorColor)]" />
      </div>
      <p className="text-[var(--errorColor)] font-bold text-sm">{message}</p>
    </div>
  </div>
);

function TableBody<T>({ data, renderRow, emptyMessage }: TableBodyProps<T>) {
  const { searchQuery } = useDataTableContext();
  return (
    <tbody className="divide-y divide-[var(--borderColor)]/30">
      {data.length === 0 ? (
        <tr>
          <td
            colSpan={100}
            className="px-4 py-16 text-center text-[var(--textMuted2)] text-sm"
          >
            {searchQuery
              ? "لا توجد نتائج مطابقة لبحثك"
              : emptyMessage || "لا توجد بيانات متاحة"}
          </td>
        </tr>
      ) : (
        data.map((item, index) => renderRow(item, index))
      )}
    </tbody>
  );
}

export const DataTable = {
  Root,
  Header,
  SearchInput,
  Filter: FilterSelect,
  AddButton,
  Table,
  TableHead: ({ children, className = "" }: HeaderProps) => (
    <thead className={`bg-[var(--fillColor)] ${className}`}>{children}</thead>
  ),
  TableBody,
  TableHeaderCell: ({ children, className = "" }: HeaderProps) => (
    <th
      className={`px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-[var(--textMuted2)] whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  ),
  TableRow: ({ children, className = "" }: HeaderProps) => (
    <tr
      className={`hover:bg-[var(--fillColor)]/40 transition-colors duration-150 ${className}`}
    >
      {children}
    </tr>
  ),
  TableCell: ({ children, className = "" }: TableCellProps) => (
    <td className={`px-4 py-3.5 text-sm text-[var(--textColor)] ${className}`}>
      {children}
    </td>
  ),
  ModalWrapper: ({ children }: { children: ReactNode }) => {
    const { isModalOpen } = useDataTableContext();
    return isModalOpen ? <>{children}</> : null;
  },
  ResultsCount,
  Loading,
  Error: ErrorMessage,
  useContext: useDataTableContext,
};
