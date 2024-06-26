let user = {
    'nama': '',
    'umur': '',
    'tinggi': '',
    'berat': '',
    'kelamin': '',
    'activity': '',
    'kalori makanan': 0
};
// list makanan
let foods = [
    { nama: 'nasi putih', kalori: 150 },
    { nama: 'ayam goreng', kalori: 250 },
    { nama: 'sayur bayam', kalori: 50 },
    { nama: 'pisang', kalori: 100 },
    { nama: 'roti tawar', kalori: 80 },
    { nama: 'telur rebus', kalori: 70 },
    { nama: 'ikan salmon panggang', kalori: 200 },
    { nama: 'kacang almond', kalori: 160 },
    { nama: 'susu rendah lemak', kalori: 90 },
    { nama: 'yogurt plain', kalori: 120 },
    { nama: 'apel', kalori: 50 },
    { nama: 'wortel', kalori: 30 },
    { nama: 'brokoli', kalori: 40 },
    { nama: 'sereal gandum utuh', kalori: 120 },
    { nama: 'roti gandum', kalori: 100 }
];

function changepage(to) {
    // document.getElementById(to).scrollIntoView({ behavior: 'smooth' });
    document.getElementById('namauser').innerText = `Hai, ${user.nama}`

    document.getElementById(to).style.display = 'flex';
    setTimeout(function () {
        document.getElementById(to).scrollIntoView({ behavior: 'smooth' });
    }, 100);

    if (to === 'result') {
        showResult();
        compareCalorie();
        let bmi = calculateBMI(user.berat, user.tinggi)
        let saran = categorizeBMI(bmi)
        user['BMI'] = bmi

        document.getElementById('bmi').innerText = saran
    }

    if (to === 'home') {
        setTimeout(function () {
            location.reload();
        }, 1000);
    }
    console.log(user);
}

// calculate BMR nya, untuk tau jumlah kalori yang dibakar tubuh saat istirahat
function calculateBmr(data) {
    let result = 0;
    if (data.kelamin === 'male') {
        result = 66 + (13.7 * +data.berat) + (5 * +data.tinggi) - (6.8 * +data.umur);
    } else if (data.kelamin === 'female') {
        result = 655 + (9.6 * +data.berat) + (1.8 * +data.tinggi) - (4.7 * +data.umur);
    }
    return Number(result.toFixed(1));
}


// calculate TDEE nya, untuk tau jumlah kalori yang dibutuhkan tubuh dalam sehari
function calculateTdee(bmr, data) {
    let activityFactor = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very_active': 1.9
    }

    return bmr * activityFactor[data.activity];
}

// ambil goals
function getGoals(value) {
    // panggil adjustTdeeForGoal
    let adjustTdee = adjustTdeeForGoal(user['TDEE'], value)
    user['goals'] = value
    user['TDEE'] = adjustTdee

    changepage('meals')
    console.log('setelah di adjust', user);

    return value
}

// adjust TDEE nya sesuai goals user, kalo dia mau lose weight tdee/kalori harus di kurang, dan sebalik nya
function adjustTdeeForGoal(tdee, goals) {
    if (goals === 'gain') {
        // kalo mau gain, biasanya naikin 250-500 kalori/hari
        return tdee + 500
    }
    else if (goals === 'lose') {
        // kalo mau lose, biasanya cut 500-1000 kalori/hari
        return tdee - 500
    }
    else {
        return tdee
    }
}

// compare sama tdee(kalori harian) user
function compareCalorie() {
    const totalKalori = user['kalori makanan'];
    const TDEE = user['TDEE'];

    if (totalKalori > TDEE) {
        document.getElementById('conclusion').innerText = `Kamu kelebihan kalori hari ini, kebutuhan kalori kamu perhari (TDEE) ${TDEE}, kalori kamu hari ini ${totalKalori}`;
        document.querySelectorAll('#data-box, #kalori-box, #hasil-box').forEach(box => {
            box.style.backgroundColor = '#ff8f8f';
        });
        document.querySelectorAll('.calorie-box').forEach(box => {
            box.style.backgroundColor = '#eb3c3c';
        });
    } else if (totalKalori < TDEE) {
        document.getElementById('conclusion').innerText = `Kalori kamu kurang hari ini, kebutuhan kalori kamu perhari (TDEE) ${TDEE}, kalori kamu hari ini ${totalKalori}`;
        document.querySelectorAll('#data-box, #kalori-box, #hasil-box').forEach(box => {
            box.style.backgroundColor = '#ffe494';
        });
        document.querySelectorAll('.calorie-box').forEach(box => {
            box.style.backgroundColor = '#ffc107';
        });
    } else {
        document.getElementById('conclusion').innerText = `Konsumsi kalori Anda hari ini sudah tepat. Kebutuhan kalori kamu perhari (TDEE) ${TDEE}, kalori kamu hari ini ${totalKalori}`;
        document.querySelectorAll('#data-box, #kalori-box, #hasil-box').forEach(box => {
            box.style.backgroundColor = '#a4f4a4'; // Warna hijau untuk menunjukkan keseimbangan
        });
        document.querySelectorAll('.calorie-box').forEach(box => {
            box.style.backgroundColor = '#28a745'; // Warna hijau untuk menunjukkan keseimbangan
        });
    }
}


function greetings() {
    event.preventDefault();
    const form = document.getElementById('dataForm');

    // Ambil value
    const nama = form.querySelector('#username').value;
    const umur = form.querySelector('#userage').value;
    const tinggi = form.querySelector('#userheight').value;
    const berat = form.querySelector('#userweight').value;
    const kelamin = form.querySelector('#usergender').value;
    const activity = form.querySelector('#useractivity').value;

    if (nama === '' || umur === '' || tinggi === '' || berat === '' || kelamin === '' || activity === '') {
        alert('Harap lengkapi semua kolom sebelum melanjutkan!');
        return;
    }

    // assign value
    user.nama = nama
    user.umur = umur
    user.tinggi = tinggi
    user.berat = berat
    user.kelamin = kelamin
    user.activity = activity

    // calculate BMR nya, untuk tau jumlah kalori yang dibakar tubuh saat istirahat
    let bmr = calculateBmr(user);

    // calculate TDEE nya, untuk tau jumlah kalori yang dibutuhkan tubuh dalam sehari
    let tdee = calculateTdee(bmr, user);

    // tambahin data user
    user['BMR'] = bmr
    user['TDEE'] = tdee

    console.log('sebelum di adjust', user);

    // pindah section ke goals
    changepage('goals');
}

// Bagian table
let numberCounter = 0;
let tableValue = [];
let calorieCounted = 0;

function calorieCount() {
    calorieCounted = 0;
    for (let i = 0; i < tableValue.length; i++) {
        let number = tableValue[i].kalori * tableValue[i].jumlah
        calorieCounted += number;
    }

    user['kalori makanan'] = calorieCounted
}

function buttonAction(type, index, id) {
    for (let i = 0; i < tableValue.length; i++) {
        if (index === tableValue[i].nama) {
            if (type === '+') {
                tableValue[i].jumlah += 1;
                tableValue[i].totalCal += tableValue[i].kalori;
                document.getElementById(`colCal-${index}`).innerText = tableValue[i].totalCal;
                document.getElementById(`colQty-${index}`).innerText = tableValue[i].jumlah;
            } else if (type === '-') {
                if (tableValue[i].jumlah > 1) {
                    tableValue[i].jumlah -= 1;
                    tableValue[i].totalCal -= tableValue[i].kalori;
                    document.getElementById(`colCal-${index}`).innerText = tableValue[i].totalCal;
                    document.getElementById(`colQty-${index}`).innerText = tableValue[i].jumlah;
                }
            } else if (type === 'hapus') {
                for (let j = 0; j < tableValue.length; j++) {
                    if (tableValue[j].id === id) {
                        foods.push({ nama: tableValue[j].nama, kalori: tableValue[j].kalori })
                        tableValue.splice(j, 1)
                        break;
                    }
                }

                let tableContent = '';
                numberCounter = 0;
                document.getElementById('tableBody').innerHTML = '';

                for (let i = 0; i < tableValue.length; i++) {
                    numberCounter++;
                    tableValue[i].id = numberCounter;
                    tableContent += `
                                        <tr>
                                            <td>${numberCounter}</td>
                                            <td>${tableValue[i].nama}</td>
                                            <td id="colCal-${tableValue[i].nama}">${tableValue[i].totalCal}</td>
                                            <td id="colQty-${tableValue[i].nama}">${tableValue[i].jumlah}</td>
                                            <td>
                                                <button type="button" class="btn btn-outline-success" onclick="buttonAction('+', '${tableValue[i].nama}')">+</button>
                                                <button type="button" class="btn btn-outline-primary" onclick="buttonAction('-', '${tableValue[i].nama}')">-</button>
                                                <button type="button" class="btn btn-outline-danger" onclick="buttonAction('hapus', '${tableValue[i].nama}', ${tableValue[i].id})">Hapus</button>
                                            </td>
                                        </tr>
                                        `
                }

                document.getElementById('tableBody').innerHTML = tableContent;
                console.log(tableContent);
                updateFoodsMaterials();

            }
        }
    }
    calorieCount()
    document.getElementById('calCount').innerText = calorieCounted;
    user['kalori makanan'] = calorieCounted
}

// Bagian calorie counter dan tambah makanan
let selectOption = document.getElementById('meal').innerHTML;

for (let i = 0; i < foods.length; i++) {
    selectOption += `<option value="${foods[i].nama}">${foods[i].nama}</option>`
}

document.getElementById('meal').innerHTML = selectOption;

function updateFoodsMaterials() {
    selectOption = '';

    for (let i = 0; i < foods.length; i++) {
        selectOption += `<option value="${foods[i].nama}">${foods[i].nama}</option>`
    }

    document.getElementById('meal').innerHTML = selectOption;
}

function addMeal() {
    let selected = document.getElementById('meal').value;
    for (let i = 0; i < foods.length; i++) {
        if (selected === foods[i].nama) {
            foods[i]['id'] = numberCounter;
            foods[i]['jumlah'] = 1;
            foods[i]['totalCal'] = foods[i].kalori;
            tableValue.push(foods[i]);
            document.getElementById('tableBody').innerHTML +=
                `
                    <tr>
                        <td>${numberCounter += 1}</td>
                        <td>${foods[i].nama}</td>
                        <td id="colCal-${foods[i].nama}">${foods[i].totalCal}</td>
                        <td id="colQty-${foods[i].nama}">${1}</td>
                        <td>
                            <button type="button" class="btn btn-outline-success" onclick="buttonAction('+', '${foods[i].nama}')">+</button>
                            <button type="button" class="btn btn-outline-primary" onclick="buttonAction('-', '${foods[i].nama}')">-</button>
                            <button type="button" class="btn btn-outline-danger" onclick="buttonAction('hapus', '${foods[i].nama}', ${foods[i].id})">Hapus</button>
                        </td>
                    </tr>
                `;

            calorieCount();
            document.getElementById('calCount').innerText = calorieCounted;
            user['kalori makanan'] = calorieCounted

            foods.splice(i, 1)
            updateFoodsMaterials();
        }
    }
}

function showResult() {
    // isi untuk result
    document.getElementById('umur').innerText = user.umur;
    document.getElementById('tinggi').innerText = `${user.tinggi}cm`;
    document.getElementById('bb').innerText = `${user.berat}kg`;

    document.getElementById('bmrResult').innerText = user['BMR'];
    document.getElementById('tdeeResult').innerText = user['TDEE'];
    document.getElementById('kaloriMakanan').innerText = user['kalori makanan'];
}

// menghitung BMI
function calculateBMI(berat, tinggi) {
    // Konversi tinggi dari cm ke meter
    tinggi = tinggi / 100;

    let bmi = berat / (tinggi * tinggi);

    bmi = bmi.toFixed(2);

    return bmi;
}

// mengkategorikan BMI
function categorizeBMI(bmi) {
    let result = '';

    if (bmi < 18.5) {
        result = "Berat badan kurang";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        result = "Berat badan normal";
    } else if (bmi >= 25 && bmi <= 29.9) {
        result = "Berat badan berlebih (overweight)";
    } else {
        result = "Obesitas";
    }

    switch (result) {
        case "Berat badan kurang":
            return `BMI kamu ${bmi}, menunjukkan berat badan kurang. Pastikan untuk memperbanyak asupan nutrisi dan konsultasikan dengan ahli gizi untuk mendapatkan nasihat yang tepat.`;
        case "Berat badan normal":
            return `BMI kamu ${bmi}, berada dalam kisaran berat badan normal. Pertahankan pola makan sehat dan rutin berolahraga untuk menjaga kesehatan secara keseluruhan.`;
        case "Berat badan berlebih (overweight)":
            return `BMI kamu ${bmi}, menunjukkan berat badan berlebih. Perbanyak olahraga dan perhatikan pola makan sehat untuk menurunkan berat badan secara bertahap.`;
        case "Obesitas":
            return `BMI kamu ${bmi}, menunjukkan obesitas. Penting untuk mengubah gaya hidup dengan mengatur pola makan sehat dan rutin berolahraga untuk mengurangi risiko masalah kesehatan yang lebih serius.`;
        default:
            return "Tidak dapat memberikan saran karena kategori BMI tidak valid.";
    }
}