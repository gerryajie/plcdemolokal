export default function ReportTable({
  currentData,
}) {

  return (

    <div className="overflow-auto rounded-2xl border border-white/10">

      <table className="w-full min-w-[720px]">

        <thead>

          <tr className="border-b border-white/10 bg-white/[0.04]">

            <th className="p-4 text-left text-sm font-semibold text-gray-300">
              Event
            </th>

            <th className="p-4 text-left text-sm font-semibold text-gray-300">
              Username
            </th>

            <th className="p-4 text-left text-sm font-semibold text-gray-300">
              Time
            </th>

          </tr>

        </thead>

        <tbody>

          {currentData.map((item) => (

            <tr
              key={item.id}
              className="border-b border-white/10 transition-colors last:border-b-0 hover:bg-white/[0.03]"
            >

              <td className="p-4 text-sm text-gray-100">

                {item.message}

              </td>

              <td className="p-4 text-sm font-bold text-emerald-400">
                {item.username}
              </td>

              <td className="p-4 text-sm text-gray-300">

                {new Date(
                  item.createdAt
                ).toLocaleString()}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );

}
