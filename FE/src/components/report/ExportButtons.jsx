import * as XLSX from "xlsx";

import { saveAs } from "file-saver";

export default function ExportButtons({
  data,
  period,
  dateFilter,
  isAdmin,
}) {

  const filePeriod =
    period || "daily";

  const fileDate =
    dateFilter || "all";

  const fileName =
    `plc-report-${filePeriod}-${fileDate}`;

  const exportExcel = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "PLC Logs"
    );

    const excelBuffer = XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(fileData, `${fileName}.xlsx`);

  };

  const exportCSV = () => {

    const worksheet =
      XLSX.utils.json_to_sheet(data);

    const csv =
      XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    saveAs(blob, `${fileName}.csv`);

  };

  return (

    <div className="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:flex sm:flex-wrap">

      {isAdmin && (
        <>
          <button
            onClick={exportExcel}
            className="rounded-xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 px-5 py-3 font-bold text-emerald-200 transition-all hover:border-emerald-300/40 hover:bg-emerald-500/25"
          >
            Export Excel
          </button>

          <button
            onClick={exportCSV}
            className="rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/20 to-sky-500/10 px-5 py-3 font-bold text-cyan-200 transition-all hover:border-cyan-300/40 hover:bg-cyan-500/25"
          >
            Export CSV
          </button>
        </>
      )}

    </div>

  );

}
