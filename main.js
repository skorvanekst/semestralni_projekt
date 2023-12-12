let oblibene = loadOblibene();

// Aktualizovat oblíbená města při načítání stránky
updateoblibeneSeznam();

function pocasi() {
    const vlozitMesto = document.getElementById('vlozitMesto');
    const vybraneMesto = vlozitMesto.value;
    const pocasiInfo = document.getElementById('pocasiInfo');
    const pridatOblibeneBtn = document.getElementById('pridatOblibeneBtn');

    if (!vybraneMesto) {
        alert('Select city.');
        return;
    }

    const apiKey = '0502d96c11383bbdb1d69e5df5525cdb';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${vybraneMesto}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const teplota = (data.main.temp - 273.15).toFixed(2);
            const stavPocasi = data.weather[0].description; // Opraveno zde
            pocasiInfo.innerHTML = `
                <h2>${vybraneMesto}</h2>
                <p>Temperature: ${teplota}°C</p>
                <p>Weather description: ${stavPocasi}</p>
            `;

            pridatOblibeneBtn.style.display = 'block';
        })
        .catch(error => {
            console.error('Error, wrong data.:', error);
            pocasiInfo.innerHTML = '<p>Error, wrong data.</p>';
        });
}

function pridatOblibene() {
    const vlozitMesto = document.getElementById('vlozitMesto');
    const vybraneMesto = vlozitMesto.value;

    if (!vybraneMesto) {
        alert('Vložte město.');
        return;
    }

    if (!oblibene.includes(vybraneMesto)) {
        oblibene.push(vybraneMesto);
        saveOblibene();
        updateoblibeneSeznam();
    }
}

function removeOblibene(mesto) {
    oblibene = oblibene.filter(favorite => favorite !== mesto);
    saveOblibene();
    updateoblibeneSeznam();
}

function updateoblibeneSeznam() {
    const oblibeneSeznam = document.getElementById('oblibene');
    oblibeneSeznam.innerHTML = '';

    oblibene.forEach(mesto => {
        const polozka = document.createElement('li');
        polozka.textContent = mesto;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Delete';
        removeBtn.addEventListener('click', () => removeOblibene(mesto));

        polozka.appendChild(removeBtn);

        polozka.addEventListener('click', () => pocasiForFavorite(mesto));
        oblibeneSeznam.appendChild(polozka);
    });
}

function pocasiForFavorite(mesto) {
    const pocasiInfo = document.getElementById('pocasiInfo');
    const apiKey = '0502d96c11383bbdb1d69e5df5525cdb';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${mesto}&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const teplota = (data.main.temp - 273.15).toFixed(2);
            const stavPocasi = data.weather[0].description;
            pocasiInfo.innerHTML = `
                <h2>${mesto}</h2>
                <p>Temperature: ${teplota}°C</p>
                <p>Weather description: ${stavPocasi}</p>
            `;
        })
        .catch(error => {
            console.error('Error, wrong data.', error);
            pocasiInfo.innerHTML = '<p>Error, wrong data..</p>';
        });
}

function saveOblibene() {
    localStorage.setItem('oblibene', JSON.stringify(oblibene));
}

function loadOblibene() {
    const storedOblibene = localStorage.getItem('oblibene');
    return storedOblibene ? JSON.parse(storedOblibene) : [];
}
