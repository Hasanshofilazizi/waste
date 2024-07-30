function calculateWaste() {
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
    var tw = new Date(document.getElementById('tanggal').value);
    if (tw.getTimezoneOffset() == 0) (a=tw.getTime() + ( 7 *60*60*1000))
    else (a=tw.getTime());
    tw.setTime(a);
    var tahun= tw.getFullYear ();
    var hari= tw.getDay ();
    var bulan= tw.getMonth ();
    var tanggal= tw.getDate ();
    var hariarray=new Array("Minggu,","Senin,","Selasa,","Rabu,","Kamis,","Jum'at,","Sabtu,");
    var bulanarray=new Array("Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","Nopember","Desember");
    const tg = document.getElementById("tanggalwaktu").innerHTML = tanggal+" "+bulanarray[bulan]+" "+tahun;

    // Display results
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <p><strong>Jumlah hasil waste keluar tanggal ${tg} </strong></p>
        <p><strong>Waste Bubuk BC RM</strong><br>Shift 1 = ${shift1PowderWaste}Kg<br>Shift 2 = ${shift2PowderWaste}Kg<br>Shift 3 = ${shift3PowderWaste}Kg<br><strong>Jumlah : ${totalPowderWaste.toFixed(1)} Kg</strong></p>
        <p><strong>Waste Adonan Kotor</strong><br>Shift 1 = ${shift1DoughWaste}Kg<br>Shift 2 = ${shift2DoughWaste}Kg<br>Shift 3 = ${shift3DoughWaste}Kg<br><strong>Jumlah : ${totalDoughWaste.toFixed(1)} Kg</strong></p>
    `;

}

function resetbt(){
    document.getElementById('wasteForm').reset();
    document.getElementById('result').innerHTML=` `;
}

/* <p>Tanggal/Waktu: <span id="tanggalwaktu"></span></p>
<script>
var tw = new Date();
if (tw.getTimezoneOffset() == 0) (a=tw.getTime() + ( 7 *60*60*1000))
else (a=tw.getTime());
tw.setTime(a);
var tahun= tw.getFullYear ();
var hari= tw.getDay ();
var bulan= tw.getMonth ();
var tanggal= tw.getDate ();
var hariarray=new Array("Minggu,","Senin,","Selasa,","Rabu,","Kamis,","Jum'at,","Sabtu,");
var bulanarray=new Array("Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","Nopember","Desember");
document.getElementById("tanggalwaktu").innerHTML = hariarray[hari]+" "+tanggal+" "+bulanarray[bulan]+" "+tahun;
</script> */
