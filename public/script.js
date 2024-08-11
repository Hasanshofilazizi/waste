function jumlahwaste(){
    document.getElementById('saveData').style.display = 'block';
    document.getElementById('totalData').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    setTimeout(() => {
    // Retrieve values from form inputs
    const shift1PowderWaste = parseFloat(document.getElementById('shift1PowderWaste').value) || 0;
    const shift1DoughWaste = parseFloat(document.getElementById('shift1DoughWaste').value) || 0;
    const shift2PowderWaste = parseFloat(document.getElementById('shift2PowderWaste').value) || 0;
    const shift2DoughWaste = parseFloat(document.getElementById('shift2DoughWaste').value) || 0;
    const shift3PowderWaste = parseFloat(document.getElementById('shift3PowderWaste').value) || 0;
    const shift3DoughWaste = parseFloat(document.getElementById('shift3DoughWaste').value) || 0;

    // Calculate total waste for powder and dough
    const totalPowderWaste = shift1PowderWaste + shift2PowderWaste + shift3PowderWaste;
    const totalDoughWaste = shift1DoughWaste + shift2DoughWaste + shift3DoughWaste;

    document.getElementById('totalA').value = totalPowderWaste.toFixed(0);
    document.getElementById('totalB').value = totalDoughWaste.toFixed(0);

    var tw = new Date(document.getElementById('date').value);
    if (tw.getTimezoneOffset() == 0) (a=tw.getTime() + ( 7 *60*60*1000))
    else (a=tw.getTime());
    tw.setTime(a);
    var tahun= tw.getFullYear ();
    var hari= tw.getDay ();
    var bulan= tw.getMonth ();
    var tanggal= tw.getDate ();
    var hariarray=new Array("Minggu,","Senin,","Selasa,","Rabu,","Kamis,","Jum'at,","Sabtu,");
    var bulanarray=new Array("Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember");
    const tg = document.getElementById("date").innerHTML = tanggal+" "+bulanarray[bulan]+" "+tahun;



    if (shift1PowderWaste === ''|| shift1DoughWaste === ''||shift2PowderWaste === ''||shift3PowderWaste === ''||shift2DoughWaste === ''|| shift3DoughWaste === ''){
        window.alert('input tidak boleh kosong ya :)');
    }
    else {
    const resultDiv = document.getElementById('hasil');
    resultDiv.innerHTML = `
        <p><strong>Jumlah hasil waste keluar tanggal ${tg} </strong></p>
        <p><strong>Waste Bubuk BC RM</strong><br>Shift 1 = ${shift1PowderWaste} Kg<br>Shift 2 = ${shift2PowderWaste} Kg<br>Shift 3 = ${shift3PowderWaste} Kg<br><strong>Jumlah : ${totalPowderWaste.toFixed(1)} Kg</strong></p>
        <p><strong>Waste Adonan Kotor</strong><br>Shift 1 = ${shift1DoughWaste} Kg<br>Shift 2 = ${shift2DoughWaste} Kg<br>Shift 3 = ${shift3DoughWaste} Kg<br><strong>Jumlah : ${totalDoughWaste.toFixed(1)} Kg</strong></p>
    `;
    }
    document.getElementById('spinner').style.display = 'none';
    }, 1000);

}

function calculateWaste() {
    document.getElementById('totalData').style.display ='block';
    document.getElementById('saveData').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    setTimeout(() => {
    resultDiv.innerHTML = `
     <h1> Data berhasil disimpan di database </h2>
     <p> Silahkan refresh untuk input data baru </p>  
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
        console.log(data);

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
                            <th>Total Adonan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map(item => 
                            `
                            <tr>
                                <td>${item.id}</td>
                                <td>${formatDate(item.date)}</td>
                                <td>${item.shift1_powder_waste}</td>
                                <td>${item.shift2_powder_waste}</td>
                                <td>${item.shift3_powder_waste}</td>
                                <td>${parseFloat(item.shift1_powder_waste) + parseFloat(item.shift2_powder_waste) + parseFloat(item.shift3_powder_waste)}</td>
                                <td>${item.shift1_dough_waste}</td>
                                <td>${item.shift2_dough_waste}</td>
                                <td>${item.shift3_dough_waste}</td>
                                <td>${parseFloat(item.shift3_dough_waste) + parseFloat(item.shift2_dough_waste) + parseFloat(item.shift1_dough_waste)}</td>
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