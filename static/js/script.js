let signalChart, filteredSignalChart; // Объявим переменные для хранения графиков



/* SLIDER

var slider = document.getElementById("myRange");
var output = document.getElementById("amplitude");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = this.value;
}
*/

document.getElementById('signal-form').addEventListener('submit', function(e) {
e.preventDefault();





// Получение значений из формы
let signalType = document.getElementById('signal_type').value;
let amplitude = parseFloat(document.getElementById('amplitude').value);
let frequency = parseFloat(document.getElementById('frequency').value);
let noiseAmplitude = parseFloat(document.getElementById('noise_amplitude').value);
let cutoffFrequency = parseFloat(document.getElementById('cutoff_frequency').value);
let filterOrder = parseInt(document.getElementById('filter_order').value);

// Проверка значений
if (isNaN(amplitude) || isNaN(frequency) || isNaN(noiseAmplitude) || isNaN(cutoffFrequency) || isNaN(filterOrder) ||
    amplitude <= 0 || frequency <= 0 || noiseAmplitude < 0 || cutoffFrequency <= 0 || filterOrder <= 0) {
    alert('Пожалуйста, введите корректные положительные числовые значения.');
    return;
}

fetch('/filter', {
method: 'POST',
headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
},
body: new URLSearchParams({
    'signal_type': signalType,
    'amplitude': amplitude,
    'frequency': frequency,
    'noise_amplitude': noiseAmplitude,
    'cutoff_frequency': cutoffFrequency,
    'filter_order': filterOrder,
}),
})
.then(response => response.json())
.then(data => {
let labels = data.labels;
let noisySignalData = data.data.noisy_signal;
let filteredSignalData = data.data.filtered_signal;

// Удаляем старые графики, если они существуют
if (signalChart) {
    signalChart.destroy();
}
if (filteredSignalChart) {
    filteredSignalChart.destroy();
}

// Создаем новые графики с анимацией при обновлении
signalChart = new Chart(document.getElementById('signal-chart').getContext('2d'), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Сигнал с шумом',
            data: noisySignalData,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        animation: {
            duration: 1000, // Время анимации (в миллисекундах)
            easing: 'linear', // Тип анимации (можно изменить)
        }
    }
});

filteredSignalChart = new Chart(document.getElementById('filtered-signal-chart').getContext('2d'), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Сигнал после фильтрации',
            data: filteredSignalData,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        animation: {
            duration: 1000, // Время анимации (в миллисекундах)
            easing: 'linear', // Тип анимации (можно изменить)
        }
    }
});
})
.catch(error => console.error(error));
});