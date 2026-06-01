export default function ReportFilter({
  dateFilter,
  setDateFilter,
}) {

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">


      <input
        type="date"
        value={dateFilter}
        onChange={(e) =>
          setDateFilter(e.target.value)
        }
        className="bg-[#111c36] border border-[#1e293b] rounded-2xl px-5 py-4 outline-none"
      />

    </div>

  );

}
