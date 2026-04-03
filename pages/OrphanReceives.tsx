import "../src/index.css";
import OrphanReceivesTable from "../ui/OrphanReceives/OrphanReceivesTable";

function OrphanReceives() {
  return (
    <div className="mx-4 md:mx-8 mb-8">
      <div className="mt-6 md:mt-8 mr-2 mb-6 md:mb-8 flex flex-col items-end">
        <h1 className="mb-2 text-xl md:text-2xl font-bold text-[var(--textColor)]">
          بيانات استلام الأيتام
        </h1>
        <p className="mb-4 text-[var(--subTextColor)] text-sm">
          عرض بيانات الأيتام مع حالة الكفالة والكفلاء الحاليين
        </p>
      </div>
      <OrphanReceivesTable />
    </div>
  );
}

export default OrphanReceives;
