const XlsxPopulate = require('xlsx-populate');
const express = require('express');
const router = express.Router();
const connection = require('../connection.js');
const ExcelJS = require('exceljs');

async function createExcelFile() {
  try {
    const queryTemplate = 'SELECT * FROM template';
    const queryKategori = 'SELECT * FROM kategori';

    const template = await new Promise((resolve, reject) => {
      connection.query(queryTemplate, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    const kategori = await new Promise((resolve, reject) => {
      connection.query(queryKategori, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    const groupedData = {};
    kategori.forEach((item) => {
      if (!groupedData[item.kategori]) {
        groupedData[item.kategori] = [];
      }
    });

    template.forEach((data) => {
      if (groupedData[data.kategori]) {
        groupedData[data.kategori].push(data.akun);
      }
    });

    const workbook = await XlsxPopulate.fromBlankAsync();
    const worksheet = workbook.sheet(0);

    let rowIndex = 2;
    Object.keys(groupedData).forEach((category) => {
      const accounts = groupedData[category];
      const cell = worksheet.cell(rowIndex, 1).value(category);
      cell.style({ bold: true });
      worksheet.cell(1, 1).value('Kategori').style({bold:true});
      worksheet.cell(1, 2).value('Keterangan').style({bold:true});
      accounts.forEach((account, accountIndex) => {
        worksheet.cell(rowIndex + accountIndex + 1, 1).value(category);
        worksheet.cell(rowIndex + accountIndex + 1, 2).value(account);
      });
      worksheet.cell(1, 3).value('Saldo').style({bold:true});
      worksheet.cell(1, 4).value('RKA').style({bold:true});
      worksheet.cell(1, 5).value('Pencapaian').style({bold:true});
      rowIndex += accounts.length + 1; 
    });

    const excelFilePath = 'output.xlsx';
    await workbook.toFileAsync(excelFilePath);
    return excelFilePath;
  } catch (error) {
    throw error;
  }
}

router.get('/download-excel', async (req, res) => {
  // try {
  //   const excelFilePath = await createExcelFile();
  //   res.download(excelFilePath, 'Template.xlsx');
  // } catch (err) {
  //   res.status(500).send('Error generating Excel file');
  // }
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');

  // Mengatur header kolom
  const headers = [
      { header: 'Tanggal report', key: 'tanggal_report', width: 20 },
      { header: 'Kategori', key: 'kategori', width: 20 },
      { header: 'Keterangan', key: 'keterangan', width: 20 },
      { header: 'Posisi', key: 'posisi', width: 20 },
      { header: 'RKA', key: 'rka', width: 20 },
      { header: 'Pencapaian', key: 'pencapaian', width: 20 }
  ];
  worksheet.columns = headers;

  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF87CEEB' }
  };
  ['D1', 'E1', 'F1'].forEach(cell => {
      worksheet.getCell(cell).font = { color: { argb: 'FFFF0000' } }; 
  });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=template.xlsx');

  await workbook.xlsx.write(res);
  res.end();
});

module.exports = router;
