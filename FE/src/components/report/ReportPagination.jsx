import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function ReportPagination({
  currentPage,
  totalPages,
  setCurrentPage,
  totalItems,
  startItem,
  endItem,
  itemsPerPage,
  setItemsPerPage,
}) {

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page += 1) {
        pages.push(page);
      }

      return pages;
    }

    pages.push(1);

    if (currentPage <= 4) {
      for (let page = 2; page <= 5; page += 1) {
        pages.push(page);
      }

      pages.push("right-ellipsis");
      pages.push(totalPages);

      return pages;
    }

    if (currentPage >= totalPages - 3) {
    pages.push("left-ellipsis");

      for (
        let page = totalPages - 4;
        page < totalPages;
        page += 1
      ) {
        pages.push(page);
      }

      pages.push(totalPages);

      return pages;
    }

      pages.push("left-ellipsis");

    const startPage =
      Math.max(2, currentPage - 1);

    const endPage =
      Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page += 1) {
      pages.push(page);
    }

    pages.push("right-ellipsis");
    pages.push(totalPages);

    return pages;
  };

  const goToPage =
    (page) => {
      const nextPage =
        Math.min(
          Math.max(page, 1),
          totalPages
        );

      setCurrentPage(nextPage);
    };

  const pageSizeOptions =
    [5, 10, 25, 50];

  return (

    <div
      className="
        mt-8
        flex
        flex-col
        gap-4
        rounded-xl
        border
        border-[#1f2f5c]
        bg-[#091229]
        px-4
        py-3
        shadow-inner
        shadow-black/20
        lg:flex-row
        lg:items-center
        lg:justify-between
      "
    >

      <div className="flex flex-wrap items-center gap-2 text-sm">

        <div
          className="
            rounded-lg
            border
            border-[#24365f]
            bg-[#0f1b3d]
            px-3
            py-2
            font-semibold
            text-gray-100
          "
        >
          {totalItems} Data
        </div>

        <div
          className="
            rounded-lg
            border
            border-[#1f2f5c]
            bg-[#0d1836]
            px-3
            py-2
            text-gray-400
          "
        >
          Showing{" "}
          <span className="font-semibold text-white">
            {startItem}
          </span>
          {" - "}
          <span className="font-semibold text-white">
            {endItem}
          </span>
          {" of "}
          <span className="font-semibold text-white">
            {totalItems}
          </span>
        </div>

        <select
          value={itemsPerPage}
          onChange={(event) => {
            setItemsPerPage(
              Number(event.target.value)
            );
            setCurrentPage(1);
          }}
          className="
            rounded-lg
            border
            border-[#1f2f5c]
            bg-[#0d1836]
            px-3
            py-2
            text-white
            outline-none
            transition
            hover:border-green-400/40
          "
        >
          {pageSizeOptions.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option} / page
            </option>
          ))}
        </select>

      </div>

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-1.5
          rounded-lg
          border
          border-[#1f2f5c]
          bg-[#0d1836]
          p-1.5
        "
      >

        <button
          disabled={currentPage === 1}
          onClick={() => goToPage(1)}
          className="
            grid
            h-9
            w-9
            place-items-center
            rounded-md
            border
            border-transparent
            bg-transparent
            text-gray-200
            transition
            hover:bg-[#152553]
            hover:text-green-400
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          title="First page"
        >
          <ChevronsLeft size={18} />
        </button>

        <button
          disabled={currentPage === 1}
          onClick={() =>
            goToPage(currentPage - 1)
          }
          className="
            grid
            h-9
            w-9
            place-items-center
            rounded-md
            border
            border-transparent
            bg-transparent
            text-gray-200
            transition
            hover:bg-[#152553]
            hover:text-green-400
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          title="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((page) => (
          typeof page === "number" ? (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`
                h-9
                min-w-9
                rounded-md
                border
                px-3
                text-sm
                font-semibold
                transition
                ${
                  page === currentPage
                    ? "border-green-400/60 bg-green-500/15 text-green-300"
                    : "border-transparent bg-transparent text-gray-300 hover:bg-[#152553] hover:text-green-400"
                }
              `}
            >
              {page}
            </button>
          ) : (
            <span
              key={page}
              className="px-2 text-gray-500"
            >
              ...
            </span>
          )
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            goToPage(currentPage + 1)
          }
          className="
            grid
            h-9
            w-9
            place-items-center
            rounded-md
            border
            border-transparent
            bg-transparent
            text-gray-200
            transition
            hover:bg-[#152553]
            hover:text-green-400
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          title="Next page"
        >
          <ChevronRight size={18} />
        </button>

        <button
          disabled={currentPage === totalPages}
          onClick={() => goToPage(totalPages)}
          className="
            grid
            h-9
            w-9
            place-items-center
            rounded-md
            border
            border-transparent
            bg-transparent
            text-gray-200
            transition
            hover:bg-[#152553]
            hover:text-green-400
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          title="Last page"
        >
          <ChevronsRight size={18} />
        </button>

      </div>

    </div>

  );

}
