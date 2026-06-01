export default function Header() {

  return (

    <div
      className="
        mb-6
        rounded-2xl
        border
        border-white/10
        bg-[linear-gradient(135deg,rgba(8,16,40,0.94),rgba(14,27,55,0.88)_55%,rgba(6,78,59,0.26))]
        p-4
        shadow-2xl
        shadow-black/20
        sm:p-6
        md:mb-8
      "
    >

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <h1 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
          <i>Industrial Monitoring PLC demo version</i>
        </h1>

        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-200 shadow-lg shadow-emerald-500/10 animate-[versionPulse_3.4s_ease-in-out_infinite]">
          <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.75)]" />
          Demo Version
        </span>

      </div>

      <p className="mt-2 text-sm text-gray-400 sm:text-base">
        Created 2026 by Gerry
      </p>

    </div>

  );
}
