import "../src/index.css";
import SalariesTable from "../ui/Salaries/SalariesTable";

function Salaries() {
  return (
    <div className="mx-4 md:mx-8 mb-8">
      <div className="mt-6 md:mt-8 mr-2 mb-6 md:mb-8 flex flex-col items-end">
        <h1 className="mb-2 text-xl md:text-2xl font-bold text-[var(--textColor)]">
          نظام الرواتب الشهرية
        </h1>
        <p className="mb-4 text-[var(--subTextColor)] text-sm">
          إدارة ومتابعة رواتب الأيتام الشهرية
        </p>
      </div>
      <SalariesTable />
    </div>
  );
}

export default Salaries;
