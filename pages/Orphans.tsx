import "../src/index.css";
import OrphansTable from "../ui/Orphans/OrphansTable";

function Orphans() {
  return (
    <div className="mx-8 mb-8 ">
      <div className="mt-8 mr-2 mb-8 flex flex-col items-end ">
        <h1 className="mb-8 text-2xl font-semibold ">إدارة الأيتام</h1>
        <p className="mb-4 text-[var(--subTextColor)] text-lg ">
          إضافة وإدارة بيانات الأيتام والمعايير التفضيلية
        </p>
      </div>
      <OrphansTable />
    </div>
  );
}

export default Orphans;
