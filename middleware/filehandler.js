const fs = require('fs');
const csv = require('csv-parser');
const excel = require('exceljs');
const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const isEmptyRow = Object.values(data).some((value) => value === '');
        if (!isEmptyRow) {
          results.push(data);
        }
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};
const readExcel = (filePath) => {
  return new Promise((resolve, reject) => {
    const workbook = new excel.Workbook();
    workbook.xlsx.readFile(filePath)
      .then(() => {
        const worksheet = workbook.getWorksheet(1);
        const rows = [];
        worksheet.eachRow((row, rowNumber) => {
          const rowData = {};
          let isEmptyRow = true; 
          row.eachCell((cell, colNumber) => {
            if (cell.type === excel.ValueType.Formula) {
              rowData[`col${colNumber}`] = cell.result;
            } else {
              rowData[`col${colNumber}`] = cell.value;
            }
            if (cell.value !== null && cell.value !== '') {
              isEmptyRow = false; 
            }
          });
          if (!isEmptyRow && rowNumber !== 1) { 
            rows.push(rowData);
          }
        });
        resolve(rows);
      })
      .catch((error) => reject(error));
  });
};

module.exports = { readCSV, readExcel };
