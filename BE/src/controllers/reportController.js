const ExcelJS = require("exceljs");

const PDFDocument = require("pdfkit");

const PlcLog = require("../models/PlcLog");

exports.exportExcel = async (
  req,
  res
) => {
  const logs = await PlcLog.findAll();

  const workbook = new ExcelJS.Workbook();

  const sheet =
    workbook.addWorksheet("PLC Report");

  sheet.columns = [
    {
      header: "Username",
      key: "username",
    },
    {
      header: "Event",
      key: "message",
    },
    {
      header: "Time",
      key: "createdAt",
    },
  ];

  logs.forEach((log) => {
    sheet.addRow({
      username: log.username,
      message: log.message,
      createdAt: log.createdAt
        ? new Date(log.createdAt).toLocaleString()
        : null,
    });
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=report.xlsx"
  );

  await workbook.xlsx.write(res);

  res.end();
};

exports.exportPDF = async (
  req,
  res
) => {
  const logs = await PlcLog.findAll();

  const doc = new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=report.pdf"
  );

  doc.pipe(res);

  doc
    .fontSize(24)
    .text("PLC Monitoring Report");

  doc.moveDown();

  logs.forEach((log, index) => {
    doc.text(
      `${index + 1}. ${log.message} | ${new Date(
        log.createdAt
      ).toLocaleString()}`
    );
  });

  doc.end();
};
