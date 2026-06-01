import {
  useEffect,
  useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import ReportHeader from "../components/report/ReportHeader";

import ReportTable from "../components/report/ReportTable";

import ReportPagination from "../components/report/ReportPagination";

import ExportButtons from "../components/report/ExportButtons";

import {
  getReports,
} from "../services/reportService";

export default function Report() {


  const [logs, setLogs] =
    useState([]);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [eventFilter,
    setEventFilter] =
    useState("");

  const [dateFilter,
    setDateFilter] =
    useState("");

  const [period,
    setPeriod] =
    useState("daily");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const [itemsPerPage,
    setItemsPerPage] =
    useState(10);

  const getDateRange =
    (selectedDate, selectedPeriod) => {

      if (!selectedDate) {

        return null;

      }

      const start = new Date(
        `${selectedDate}T00:00:00`
      );

      const end = new Date(start);

      if (selectedPeriod === "weekly") {

        const day =
          start.getDay();

        const diffToMonday =
          day === 0 ? -6 : 1 - day;

        start.setDate(
          start.getDate() + diffToMonday
        );

        end.setTime(
          start.getTime()
        );

        end.setDate(
          start.getDate() + 6
        );

      }

      if (selectedPeriod === "monthly") {

        start.setDate(1);

        end.setMonth(
          start.getMonth() + 1,
          0
        );

      }

      if (selectedPeriod === "yearly") {

        start.setMonth(0, 1);

        end.setMonth(11, 31);

      }

      end.setHours(
        23,
        59,
        59,
        999
      );

      return {
        start,
        end,
      };

    };


  useEffect(() => {

    let isMounted =
      true;

    const fetchReports =
      async () => {

      try {

        const data =
          await getReports();


        const rows =
          Array.isArray(data)
            ? data
            : data.rows || [];

        if (isMounted) {

          setLogs(rows);

          setIsAdmin(
            localStorage.getItem("role") ===
              "admin"
          );

        }

      } catch (error) {

        console.log(error);

        if (isMounted) {

          setLogs([]);

        }

      }

    };

    fetchReports();

    return () => {

      isMounted =
        false;

    };

  }, []);


  const filteredLogs =
    (logs || []).filter(
      (item) => {


        let eventMatch =
          true;

        if (
          eventFilter ===
          "START"
        ) {

          eventMatch =
            item.message?.includes(
              "START"
            );

        }

        if (
          eventFilter ===
          "BATTERY"
        ) {

          eventMatch =
            item.message?.includes(
              "BATTERY"
            );

        }

        if (
          eventFilter ===
          "SHORT"
        ) {

          eventMatch =
            item.message?.includes(
              "SHORT"
            );

        }

        if (
          eventFilter ===
          "TIME"
        ) {

          eventMatch =
            item.message?.includes(
              "TIME"
            );

        }


        const range =
          getDateRange(
            dateFilter,
            period
          );

        const itemDate =
          item.createdAt
            ? new Date(item.createdAt)
            : null;

        const dateMatch =
          range && itemDate

            ? itemDate >= range.start &&
              itemDate <= range.end

            : true;

        return (
          eventMatch &&
          dateMatch
        );

      }
    );


  const totalPages =
    Math.max(
      Math.ceil(
      (filteredLogs?.length || 0)
      / itemsPerPage
      ),
      1
    );

  const startIndex =
    (currentPage - 1)
    * itemsPerPage;

  const totalItems =
    filteredLogs?.length || 0;

  const startItem =
    totalItems > 0
      ? startIndex + 1
      : 0;

  const endItem =
    Math.min(
      startIndex + itemsPerPage,
      totalItems
    );

  const currentData =
    (filteredLogs || []).slice(
      startIndex,
      startIndex + itemsPerPage
    );


  return (

    <MainLayout>

      <div
        className="
        bg-[linear-gradient(135deg,rgba(8,16,40,0.96),rgba(12,27,55,0.9)_58%,rgba(6,78,59,0.18))]
        border
        border-white/10
        rounded-2xl
        p-4
        shadow-2xl
        shadow-black/20
        sm:p-6
        xl:p-8
      "
      >


        <div
          className="
            flex
            flex-col
            gap-4
            mb-5
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:mb-6
          "
        >

          <div>

            <ReportHeader />

          </div>

          <div
            className="
              bg-white/[0.05]
              border
              border-white/10
              rounded-2xl
              px-4
              py-3
              sm:px-5
            "
          >

            <p
              className="
                text-sm
                text-gray-400
              "
            >

              Report Type

            </p>

            <h2
              className="
                text-green-400
                font-bold
                text-xl
              "
            >

              {period.toUpperCase()}

            </h2>

          </div>

        </div>


        <div
          className="
            grid
            grid-cols-1
            gap-3
            mb-5
            md:grid-cols-3
            md:gap-4
            md:mb-6
          "
        >


          <select

            value={eventFilter}

            onChange={(e) =>
              {
                setEventFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }
            }

            className="
              bg-[#0d1836]
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              transition
              focus:border-emerald-400/60
              md:py-4
            "
          >

            <option value="">
              All Events
            </option>

            <option value="START">
              START ENGINE
            </option>

            <option value="BATTERY">
              BATTERY LOW
            </option>

            <option value="SHORT">
              SHORT CIRCUIT
            </option>

            <option value="TIME">
              TIME PREVENTIVE
            </option>

          </select>


          <input

            type="date"

            value={dateFilter}

            onChange={(e) =>
              {
                setDateFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }
            }

            className="
              bg-[#0d1836]
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              transition
              focus:border-emerald-400/60
              md:py-4
            "
          />


          <select

            value={period}

            onChange={(e) =>
              {
                setPeriod(
                  e.target.value
                );

                setCurrentPage(1);
              }
            }

            className="
              bg-[#0d1836]
              border
              border-white/10
              rounded-xl
              px-4
              py-3
              text-white
              outline-none
              transition
              focus:border-emerald-400/60
              md:py-4
            "
          >

            <option value="daily">
              Daily Report
            </option>

            <option value="weekly">
              Weekly Report
            </option>

            <option value="monthly">
              Monthly Report
            </option>

            <option value="yearly">
              Yearly Report
            </option>

          </select>

        </div>


        <ExportButtons
          data={filteredLogs}
          period={period}
          dateFilter={dateFilter}
          isAdmin={isAdmin}
        />


        <ReportTable
          currentData={
            currentData
          }
          isAdmin={isAdmin}
        />


        {

          totalItems > 0 && (

            <ReportPagination

              currentPage={
                currentPage
              }

              totalPages={
                totalPages
              }

              setCurrentPage={
                setCurrentPage
              }

              totalItems={
                totalItems
              }

              startItem={
                startItem
              }

              endItem={
                endItem
              }

              itemsPerPage={
                itemsPerPage
              }

              setItemsPerPage={
                setItemsPerPage
              }

            />

          )

        }


        {

          currentData.length === 0 && (

            <div
              className="
              text-center
              text-gray-400
              py-10
            "
            >

              No historian data found

            </div>

          )

        }

      </div>

    </MainLayout>

  );

}
