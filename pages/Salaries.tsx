import "../src/index.css";
import SalariesTable from "../ui/Salaries/SalariesTable";

function SponserShips() {
  return (
      <div className="mx-8 mb-8">
        <div className="mt-8 mr-2 mb-8 flex flex-col items-end">
          <h1 className="mb-8 text-2xl font-semibold ">
            {" "}
            نظام الرواتب الشهرية
          </h1>
          <p className="mb-4 text-[var(--subTextColor)] text-lg">
            إدارة ومتابعة رواتب الأيتام الشهرية
          </p>
        </div>
        <SalariesTable />
      </div>
  );
}

export default SponserShips;
