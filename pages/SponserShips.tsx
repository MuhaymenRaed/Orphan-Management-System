import "../src/index.css";
import SponserShipTable from "../ui/SponserShips/SponserShipTable";

function SponserShips() {
  return (
    <div className="mx-4 md:mx-8 mb-8">
      <div className="mt-6 md:mt-8 mr-2 mb-6 md:mb-8 flex flex-col items-end">
        <h1 className="mb-2 text-xl md:text-2xl font-bold text-[var(--textColor)]">
          إدارة البيانات
        </h1>
        <p className="mb-4 text-[var(--subTextColor)] text-sm">
          عرض معلومات الأيتام و الكفلاء
        </p>
      </div>
      <SponserShipTable />
    </div>
  );
}

export default SponserShips;
