const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');
const ExcelJS = require('exceljs');

const app = express();
const port = 3000;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/waste', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'waste.html'));
});

app.post('/submit', async (req, res) => {
  const {
    date,
    shift1PowderWaste,
    shift1DoughWaste,
    shift2PowderWaste,
    shift2DoughWaste,
    shift3PowderWaste,
    shift3DoughWaste
  } = req.body;
  let totalA = parseFloat(shift1PowderWaste) + parseFloat(shift2PowderWaste) + parseFloat(shift3PowderWaste);
  let totalB = parseFloat(shift1DoughWaste) + parseFloat(shift2DoughWaste) + parseFloat(shift3DoughWaste);

  try {
    await pool.query(
      `INSERT INTO waste_data (date, shift1_powder_waste, shift1_dough_waste, shift2_powder_waste, shift2_dough_waste, shift3_powder_waste, shift3_dough_waste, totala, totalb)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [date, shift1PowderWaste, shift1DoughWaste, shift2PowderWaste, shift2DoughWaste, shift3PowderWaste, shift3DoughWaste, totalA, totalB]
    );
    res.send('<h2>Data inserted successfully!</h2>');
  } catch (err) {
    console.error(err);
    res.status(500).send('<h2>Error inserting data</h2>');
  }
});


// Fetch data (GET request)
app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM waste_data');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('<h2>Error fetching data</h2>');
  }
});

// Download data as XLS (GET request)
app.get('/download', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM waste_data');
    const data = result.rows;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Waste Data');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Shift 1 - Waste Bubuk', key: 'shift1_powder_waste', width: 20 },
      { header: 'Shift 2 - Waste Bubuk', key: 'shift2_powder_waste', width: 20 },
      { header: 'Shift 3 - Waste Bubuk', key: 'shift3_powder_waste', width: 20 },
      { header: 'Total Waste Bubuk', key: 'totala', width: 20 },
      { header: 'Shift 1 - Waste Adonan', key: 'shift1_dough_waste', width: 20 },
      { header: 'Shift 2 - Waste Adonan', key: 'shift2_dough_waste', width: 20 },
      { header: 'Shift 3 - Waste Adonan', key: 'shift3_dough_waste', width: 20 },
      { header: 'Total Waste Adonan', key: 'totalb', width: 20 }
    ];

    data.forEach(row => {
      worksheet.addRow(row);
    });

    res.setHeader('Content-Disposition', 'attachment; filename=waste_data.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('<h2>Error generating XLS file</h2>');
  }
});

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
