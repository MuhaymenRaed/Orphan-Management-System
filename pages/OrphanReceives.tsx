import "../src/index.css";
import OrphanReceivesTable from "../ui/OrphanReceives/OrphanReceivesTable";

function OrphanReceives() {
  return (
    <div className="mx-4 md:mx-8 mb-8">
      <div className="mt-6 md:mt-8 mr-2 mb-6 md:mb-8 flex flex-col items-end">
        <h1 className="mb-2 text-xl md:text-2xl font-bold text-[var(--textColor)]">
          استلامات الأيتام
        </h1>
        <p className="mb-4 text-[var(--subTextColor)] text-sm">
          عرض الحالة المالية لكل يتيم مع مصادر التمويل والعجز المالي
        </p>
      </div>
      <OrphanReceivesTable />
    </div>
  );
}

export default OrphanReceives;
