import "../src/index.css";
import SponserShipTable from "../ui/SponserShips/SponserShipTable";

function SponserShips() {
  return (
    <div className="mx-8 mb-8">
      <div className="mt-8 mr-2 mb-8 flex flex-col items-end">
        <h1 className="mb-8 text-2xl font-semibold ">إدارة البيانات</h1>
        <p className="mb-4 text-[var(--subTextColor)] text-lg">
          عرض معلومات الأيتام و الكفلاء
        </p>
      </div>
      <SponserShipTable />
    </div>
  );
}

export default SponserShips;
