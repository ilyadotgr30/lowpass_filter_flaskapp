from flask import Flask, render_template, request, jsonify
import numpy as np
from scipy.signal import butter, lfilter

app = Flask(__name__)

def lowpass_filter(data, cutoff, fs, order=5):
    nyquist = 0.5 * fs
    normal_cutoff = cutoff / nyquist
    b, a = butter(order, normal_cutoff, btype='low', analog=False)
    filtered_data = lfilter(b, a, data)
    return filtered_data

def generate_signal(signal_type, amplitude, frequency, noise_amplitude):
    t = np.linspace(0, 1, 1000, endpoint=False)
    if signal_type == 'sine':
        signal = amplitude * np.sin(2 * np.pi * frequency * t)
    elif signal_type == 'square':
        signal = amplitude * np.sign(np.sin(2 * np.pi * frequency * t))
    elif signal_type == 'triangle':
        signal = amplitude * (2 * np.arcsin(np.sin(2 * np.pi * frequency * t)) / np.pi)
    noise = noise_amplitude * np.random.randn(1000)
    noisy_signal = signal + noise
    return noisy_signal

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/filter', methods=['POST'])
def filter_signal():
    signal_type = request.form['signal_type']
    amplitude = float(request.form['amplitude'])
    frequency = float(request.form['frequency'])
    noise_amplitude = float(request.form['noise_amplitude'])
    cutoff_frequency = float(request.form['cutoff_frequency'])
    filter_order = int(request.form['filter_order'])

    fs = 1000  # Частота дискретизации (можно изменить)

    noisy_signal = generate_signal(signal_type, amplitude, frequency, noise_amplitude)

    # Применение фильтра низких частот
    filtered_signal = lowpass_filter(noisy_signal, cutoff_frequency, fs, order=filter_order)

    # Подготовка данных для графиков
    labels = np.linspace(0, 1, 1000).tolist()

    return jsonify({'data': {'noisy_signal': noisy_signal.tolist(), 'filtered_signal': filtered_signal.tolist()}, 'labels': labels})

if __name__ == '__main__':
    app.run(debug=True)
