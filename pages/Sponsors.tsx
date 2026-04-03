import "../src/index.css";
import Cards from "../ui/Cards";
import SponsorsTable from "../ui/Sponsor/SponsorTable";

export default function Sponsors() {
  return (
    <div className="mx-4 md:mx-8 mb-8">
      <div className="mt-6 md:mt-8 mr-2 mb-6 md:mb-8 flex flex-col items-end">
        <h1 className="mb-2 text-xl md:text-2xl font-bold text-[var(--textColor)]">
          إدارة الكفلاء
        </h1>
        <p className="mb-4 text-[var(--subTextColor)] text-sm">
          اضافه واداره بيانات الكفلاء والمتبرعين
        </p>
      </div>
      <Cards />
      <div className="mt-5" />
      <SponsorsTable />
    </div>
  );
}
