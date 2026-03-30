import "../src/index.css";
import Cards from "../ui/Cards";
import SponsorsTable from "../ui/Sponsor/SponsorTable";

export default function Sponsors() {
  return (
    <div className="mx-8">
      <div className="mt-8 mr-2 flex flex-col items-end m-8">
        <h1 className="mb-8 text-2xl font-semibold ">إدارة الكفلاء</h1>
        <p className="mb-4 text-[var(--subTextColor)] text-lg">
          اضافه واداره بيانات الكفلاء والمتبرعين
        </p>
      </div>

      <Cards />
      <br />
      <SponsorsTable />
    </div>
  );
}
