function calculateWaste() {
    document.getElementById('spinner').style.display = 'block';
    setTimeout(() => {
    // Retrieve values from form inputs

    // Buat formatter untuk format angka
const numberFormatter = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
});

// Ambil nilai dari elemen input dan parsing ke float
const shift1PowderWaste = parseFloat(document.getElementById('shift1PowderWaste').value) || 0;
const shift1DoughWaste = parseFloat(document.getElementById('shift1DoughWaste').value) || 0;
const shift2PowderWaste = parseFloat(document.getElementById('shift2PowderWaste').value) || 0;
const shift2DoughWaste = parseFloat(document.getElementById('shift2DoughWaste').value) || 0;
const shift3PowderWaste = parseFloat(document.getElementById('shift3PowderWaste').value) || 0;
const shift3DoughWaste = parseFloat(document.getElementById('shift3DoughWaste').value) || 0;
const shift1Cair = parseFloat(document.getElementById('shift1cair').value) || 0;
const shift2Cair = parseFloat(document.getElementById('shift2cair').value) || 0;
const shift3Cair = parseFloat(document.getElementById('shift3cair').value) || 0;

// Hitung total waste untuk powder dan dough
const totalPowderWaste = shift1PowderWaste + shift2PowderWaste + shift3PowderWaste;
const totalDoughWaste = shift1DoughWaste + shift2DoughWaste + shift3DoughWaste;
const totalCair = shift1Cair + shift2Cair + shift3Cair;

// Format angka
const formattedShift1PowderWaste = numberFormatter.format(shift1PowderWaste);
const formattedShift2PowderWaste = numberFormatter.format(shift2PowderWaste);
const formattedShift3PowderWaste = numberFormatter.format(shift3PowderWaste);
const formattedTotalPowderWaste = numberFormatter.format(totalPowderWaste);

const formattedShift1DoughWaste = numberFormatter.format(shift1DoughWaste);
const formattedShift2DoughWaste = numberFormatter.format(shift2DoughWaste);
const formattedShift3DoughWaste = numberFormatter.format(shift3DoughWaste);
const formattedTotalDoughWaste = numberFormatter.format(totalDoughWaste);

const formattedShift1Cair = numberFormatter.format(shift1Cair);
const formattedShift2Cair = numberFormatter.format(shift2Cair);
const formattedShift3Cair = numberFormatter.format(shift3Cair);
const formattedTotalCair = numberFormatter.format(totalCair);

// Format tanggal
var tw = new Date(document.getElementById('date').value);
if (tw.getTimezoneOffset() == 0) a = tw.getTime() + (7 * 60 * 60 * 1000);
else a = tw.getTime();
tw.setTime(a);
var tahun = tw.getFullYear();
var hari = tw.getDay();
var bulan = tw.getMonth();
var tanggal = tw.getDate();
var hariarray = ["Minggu,", "Senin,", "Selasa,", "Rabu,", "Kamis,", "Jum'at,", "Sabtu,"];
var bulanarray = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const tg = tanggal + " " + bulanarray[bulan] + " " + tahun;

// Tampilkan hasil
const resultDiv = document.getElementById('hasil');
resultDiv.innerHTML = `
    <p><strong>Jumlah hasil waste keluar tanggal ${tg}</strong></p>
    <p><strong>Waste Bubuk BC RM</strong><br>Shift 1 = ${shift1PowderWaste} Kg<br>Shift 2 = ${shift2PowderWaste} Kg<br>Shift 3 = ${shift3PowderWaste} Kg<br><strong>Jumlah : ${formattedTotalPowderWaste} Kg</strong></p>
    <p><strong>Waste Adonan Kotor</strong><br>Shift 1 = ${shift1DoughWaste} Kg<br>Shift 2 = ${shift2DoughWaste} Kg<br>Shift 3 = ${shift3DoughWaste} Kg<br><strong>Jumlah : ${formattedTotalDoughWaste} Kg</strong></p>
    <p><strong>Waste Cair</strong><br>Shift 1 = ${shift1Cair} Kg<br>Shift 2 = ${shift2Cair} Kg<br>Shift 3 = ${shift3Cair} Kg<br><strong>Jumlah : ${formattedTotalCair} Kg</strong></p>
`;
document.getElementById('spinner').style.display = 'none';
}, 1000);

}

function resetForm() {
    document.getElementById('wasteForm').reset();
    document.getElementById('hasil').innerHTML = '';
}


document.addEventListener('DOMContentLoaded', () => {
    const wasteForm = document.getElementById('wasteForm');
    const resultDiv = document.getElementById('result');
    const downloadButton = document.getElementById('downloadData');

    // Handle waste data submission
    wasteForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 
        
        const formData = new FormData(wasteForm);
        const data = new URLSearchParams(formData);

        try {
            const response = await fetch('/submit', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                const text = await response.text();
                resultDiv.innerHTML = text;
                fetchData(); // Refresh the data display after submission
            } else {
                resultDiv.innerHTML = '<h2>Error submitting data</h2>';
            }
        } catch (error) {
            resultDiv.innerHTML = '<h2>Error: ' + error.message + '</h2>';
        }
    });

    const dateSearchInput = document.getElementById('dateSearch');

    const fetchData = async (searchDate = null) => {
        try {
            const response = await fetch('/data');
            const data = await response.json();

            const formatDate = (dateString) => {
                const date = new Date(dateString);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${month}/${day}/${year}`;
            };

            const formatDateForComparison = (dateString) => {
                const date = new Date(dateString);
                return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            };

            const filteredData = searchDate
                ? data.filter(item => formatDateForComparison(item.date) === searchDate)
                : data;

            if (filteredData.length > 0) {
                const table = `<table class="table table-dark table-striped table-bordered text-center">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Shift 1 - Waste Bubuk</th>
                            <th>Shift 2 - Waste Bubuk</th>
                            <th>Shift 3 - Waste Bubuk</th>
                            <th>Total Waste Bubuk</th>
                            <th>Shift 1 - Waste Adonan</th>
                            <th>Shift 2 - Waste Adonan</th>
                            <th>Shift 3 - Waste Adonan</th>
                            <th>Total Waste Adonan</th>
                            <th>Shift 1 - Waste Cair</th>
                            <th>Shift 2 - Waste Cair</th>
                            <th>Shift 3 - Waste Cair</th>
                            <th>Total Waste Cair</th> 
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map(item => 
                            `
                            <tr>
                                <td>${item.id}</td>
                                <td>${formatDate(item.date)}</td>
                                <td>${parseFloat(item.shift1_powder_waste)}</td>
                                <td>${parseFloat(item.shift2_powder_waste)}</td>
                                <td>${parseFloat(item.shift3_powder_waste)}</td>
                                <td>${parseFloat(item.shift1_powder_waste) + parseFloat(item.shift2_powder_waste) + parseFloat(item.shift3_powder_waste)}</td>
                                <td>${parseFloat(item.shift1_dough_waste)}</td>
                                <td>${parseFloat(item.shift2_dough_waste)}</td>
                                <td>${parseFloat(item.shift3_dough_waste)}</td>
                                <td>${parseFloat(item.shift3_dough_waste) + parseFloat(item.shift2_dough_waste) + parseFloat(item.shift1_dough_waste)}</td>
                                <td>${parseFloat(item.shift1_cair)}</td>
                                <td>${parseFloat(item.shift2_cair)}</td>
                                <td>${parseFloat(item.shift3_cair)}</td>
                                <td>${parseFloat(item.shift3_cair) + parseFloat(item.shift2_cair) + parseFloat(item.shift1_cair)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>`;

                resultDiv.innerHTML = table;
            } else {
                resultDiv.innerHTML = '<h2>No data available</h2>';
            }
        } catch (error) {
            resultDiv.innerHTML = '<h2>Error fetching data</h2>';
        }
    };

    dateSearchInput.addEventListener('change', (event) => {
        const selectedDate = event.target.value; // Format: YYYY-MM-DD
        fetchData(selectedDate);
    });

    // Fetch data on page load
    fetchData();

    // Handle data download as XLS
    downloadButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/download');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'waste_data.xlsx';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            resultDiv.innerHTML = '<h2>Error downloading data</h2>';
        }
    });
});

const canvas = document.getElementById('signatureCanvas');
const canvas1 = document.getElementById('signatureCanvas1');
const canvas2 = document.getElementById('signatureCanvas2');
const ctx = canvas.getContext('2d');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');

// Variables to track drawing status
let isDrawing = false;

// Function to start drawing on a canvas
function startDrawing(event, ctx) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
}

// Function to draw on a canvas
function draw(event, ctx) {
    if (isDrawing) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }
}

// Function to stop drawing on a canvas
function stopDrawing(ctx) {
    isDrawing = false;
    ctx.closePath();
}

// Add event listeners to the canvases
canvas.addEventListener('mousedown', (event) => startDrawing(event, ctx));
canvas.addEventListener('mousemove', (event) => draw(event, ctx));
canvas.addEventListener('mouseup', () => stopDrawing(ctx));

canvas1.addEventListener('mousedown', (event) => startDrawing(event, ctx1));
canvas1.addEventListener('mousemove', (event) => draw(event, ctx1));
canvas1.addEventListener('mouseup', () => stopDrawing(ctx1));

canvas2.addEventListener('mousedown', (event) => startDrawing(event, ctx2));
canvas2.addEventListener('mousemove', (event) => draw(event, ctx2));
canvas2.addEventListener('mouseup', () => stopDrawing(ctx2));

// Event handler to clear all canvases
document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
});

// Event handler to save the signature as an image
document.getElementById('saveBtn').addEventListener('click', () => {
    // For simplicity, we'll save the first canvas as an image
    const dataURL = canvas.toDataURL('image/png');
    const signatureImage = document.getElementById('signatureImage');
    signatureImage.src = dataURL;
    signatureImage.style.display = 'block';
});
