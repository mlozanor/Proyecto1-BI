document.addEventListener('DOMContentLoaded', function() {
// Variables para las pestañas
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

// Variables para la evaluación individual
const jsonInput = document.getElementById('json-input');
const evaluateButton = document.getElementById('evaluate-button');
const evalError = document.getElementById('eval-error');
const evalErrorMessage = document.getElementById('eval-error-message');
const resultContainer = document.getElementById('result-container');
const resultTitle = document.getElementById('result-title');
const resultMeta = document.getElementById('result-meta');
const resultLabel = document.getElementById('result-label');
const resultDescription = document.getElementById('result-description');
const resultPrediction = document.getElementById('result-prediction');
const probabilityBar = document.getElementById('probability-bar');
const currentIndexElement = document.getElementById('current-index');
const totalItemsElement = document.getElementById('total-items');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const totalNews = document.getElementById('total-news');
const correctPredictions = document.getElementById('correct-predictions');
const accuracy = document.getElementById('accuracy');

// Variables para la reentrada de datos
const fileUpload = document.getElementById('file-upload');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const fileSize = document.getElementById('file-size');
const uploadError = document.getElementById('upload-error');
const uploadErrorMessage = document.getElementById('upload-error-message');
const fileValid = document.getElementById('file-valid');
const fileValidMessage = document.getElementById('file-valid-message');
const uploadButton = document.getElementById('upload-button');
const uploadProgressContainer = document.getElementById('upload-progress-container');
const uploadProgressBar = document.getElementById('upload-progress-bar');
const uploadSuccess = document.getElementById('upload-success');
const previewContainer = document.getElementById('preview-container');
const previewTableBody = document.getElementById('preview-table-body');
const previewMore = document.getElementById('preview-more');
const exportTrainedModel = document.getElementById('export-trained-model');

// Variables para la evaluación de modelo
const evalFileUpload = document.getElementById('eval-file-upload');
const evalFileInfo = document.getElementById('eval-file-info');
const evalFileName = document.getElementById('eval-file-name');
const evalFileSize = document.getElementById('eval-file-size');
const evalUploadError = document.getElementById('eval-upload-error');
const evalUploadErrorMessage = document.getElementById('eval-upload-error-message');
const evalFileValid = document.getElementById('eval-file-valid');
const evalFileValidMessage = document.getElementById('eval-file-valid-message');
const evalButton = document.getElementById('eval-button');
const evalProgressContainer = document.getElementById('eval-progress-container');
const evalProgressBar = document.getElementById('eval-progress-bar');
const evalResults = document.getElementById('eval-results');
const evalSpecificModelFile = document.getElementById('eval-specific-model-file');
const evalSpecificModelName = document.getElementById('eval-specific-model-name');

// Variables para el estado de la API
const predictStatus = document.getElementById('predict-status');
const predictBadge = document.getElementById('predict-badge');
const retrainStatus = document.getElementById('retrain-status');
const retrainBadge = document.getElementById('retrain-badge');

// Variables para la información del modelo
const modelInfoButton = document.getElementById('model-info-button');
const modelInfoModal = document.getElementById('model-info-modal');
const closeModal = document.getElementById('close-modal');
const modelInfoContent = document.getElementById('model-info-content');
const exportModelButton = document.getElementById('export-model-button');
const importModelFile = document.getElementById('import-model-file');

// Variables para la evaluación individual con modelo cargado
const evalModelFile = document.getElementById('eval-model-file');
const evalModelName = document.getElementById('eval-model-name');
const evalJsonFile = document.getElementById('eval-json-file');
const evalJsonInfo = document.getElementById('eval-json-info');
const evalJsonName = document.getElementById('eval-json-name');
const evalJsonSize = document.getElementById('eval-json-size');

// Variables globales
let parsedData = null;
let currentIndex = 0;
let selectedFile = null;
let selectedEvalFile = null;
let selectedModelFile = null;
let selectedEvalModelFile = null;
let selectedEvalJsonFile = null;

// Cambio de pestañas
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Desactivar todas las pestañas
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Activar la pestaña seleccionada
        button.classList.add('active');
        const tabId = button.id.replace('tab-', 'content-');
        document.getElementById(tabId).classList.add('active');
    });
<<<<<<< HEAD
    
    // Verificar estado de la API
    async function checkApiStatus() {
        // Verificar endpoint de predicción
        try {
            const predictResponse = await fetch('http://127.0.0.1:8000/predict/', {
                method: 'HEAD',
                headers: { 'Content-Type': 'application/json' },
            }).catch(() => ({ ok: false }));
            
            if (predictResponse.ok) {
                predictStatus.classList.remove('bg-yellow-50', 'bg-red-50');
                predictStatus.classList.add('bg-green-50');
                predictStatus.querySelector('svg').classList.remove('text-yellow-600', 'text-red-600');
                predictStatus.querySelector('svg').classList.add('text-green-600');
                predictBadge.classList.remove('bg-yellow-500', 'bg-red-500');
                predictBadge.classList.add('bg-green-500');
                predictBadge.textContent = 'En línea';
            } else {
                predictStatus.classList.remove('bg-yellow-50', 'bg-green-50');
                predictStatus.classList.add('bg-red-50');
                predictStatus.querySelector('svg').classList.remove('text-yellow-600', 'text-green-600');
                predictStatus.querySelector('svg').classList.add('text-red-600');
                predictBadge.classList.remove('bg-yellow-500', 'bg-green-500');
                predictBadge.classList.add('bg-red-500');
                predictBadge.textContent = 'Desconectado';
            }
        } catch (error) {
=======
});

// Verificar estado de la API
async function checkApiStatus() {
    // Verificar endpoint de predicción
    try {
        const predictResponse = await fetch('http://localhost:8000/predict/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).catch(() => ({ ok: false }));
        
        if (predictResponse.ok) {
            predictStatus.classList.remove('bg-yellow-50', 'bg-red-50');
            predictStatus.classList.add('bg-green-50');
            predictStatus.querySelector('svg').classList.remove('text-yellow-600', 'text-red-600');
            predictStatus.querySelector('svg').classList.add('text-green-600');
            predictBadge.classList.remove('bg-yellow-500', 'bg-red-500');
            predictBadge.classList.add('bg-green-500');
            predictBadge.textContent = 'En línea';
        } else {
>>>>>>> 8dae0e7862bb6c8188a25c89d6e21ce76d86a4ec
            predictStatus.classList.remove('bg-yellow-50', 'bg-green-50');
            predictStatus.classList.add('bg-red-50');
            predictStatus.querySelector('svg').classList.remove('text-yellow-600', 'text-green-600');
            predictStatus.querySelector('svg').classList.add('text-red-600');
            predictBadge.classList.remove('bg-yellow-500', 'bg-green-500');
            predictBadge.classList.add('bg-red-500');
            predictBadge.textContent = 'Desconectado';
        }
    } catch (error) {
        console.error("Error verificando API predict:", error);
        predictStatus.classList.remove('bg-yellow-50', 'bg-green-50');
        predictStatus.classList.add('bg-red-50');
        predictStatus.querySelector('svg').classList.remove('text-yellow-600', 'text-green-600');
        predictStatus.querySelector('svg').classList.add('text-red-600');
        predictBadge.classList.remove('bg-yellow-500', 'bg-green-500');
        predictBadge.classList.add('bg-red-500');
        predictBadge.textContent = 'Desconectado';
    }
    
    // Verificar endpoint de reentrenamiento
    try {
        const retrainResponse = await fetch('http://localhost:8000/retrain/', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).catch(() => ({ ok: false }));
        
<<<<<<< HEAD
        // Verificar endpoint de reentrenamiento
        try {
            const retrainResponse = await fetch('http://127.0.0.1:8000/retrain/', {
                method: 'HEAD',
                headers: { 'Content-Type': 'application/json' },
            }).catch(() => ({ ok: false }));
            
            if (retrainResponse.ok) {
                retrainStatus.classList.remove('bg-yellow-50', 'bg-red-50');
                retrainStatus.classList.add('bg-green-50');
                retrainStatus.querySelector('svg').classList.remove('text-yellow-600', 'text-red-600');
                retrainStatus.querySelector('svg').classList.add('text-green-600');
                retrainBadge.classList.remove('bg-yellow-500', 'bg-red-500');
                retrainBadge.classList.add('bg-green-500');
                retrainBadge.textContent = 'En línea';
            } else {
                retrainStatus.classList.remove('bg-yellow-50', 'bg-green-50');
                retrainStatus.classList.add('bg-red-50');
                retrainStatus.querySelector('svg').classList.remove('text-yellow-600', 'text-green-600');
                retrainStatus.querySelector('svg').classList.add('text-red-600');
                retrainBadge.classList.remove('bg-yellow-500', 'bg-green-500');
                retrainBadge.classList.add('bg-red-500');
                retrainBadge.textContent = 'Desconectado';
            }
        } catch (error) {
=======
        if (retrainResponse.ok) {
            retrainStatus.classList.remove('bg-yellow-50', 'bg-red-50');
            retrainStatus.classList.add('bg-green-50');
            retrainStatus.querySelector('svg').classList.remove('text-yellow-600', 'text-red-600');
            retrainStatus.querySelector('svg').classList.add('text-green-600');
            retrainBadge.classList.remove('bg-yellow-500', 'bg-red-500');
            retrainBadge.classList.add('bg-green-500');
            retrainBadge.textContent = 'En línea';
        } else {
>>>>>>> 8dae0e7862bb6c8188a25c89d6e21ce76d86a4ec
            retrainStatus.classList.remove('bg-yellow-50', 'bg-green-50');
            retrainStatus.classList.add('bg-red-50');
            retrainStatus.querySelector('svg').classList.remove('text-yellow-600', 'text-green-600');
            retrainStatus.querySelector('svg').classList.add('text-red-600');
            retrainBadge.classList.remove('bg-yellow-500', 'bg-green-500');
            retrainBadge.classList.add('bg-red-500');
            retrainBadge.textContent = 'Desconectado';
        }
    } catch (error) {
        console.error("Error verificando API retrain:", error);
        retrainStatus.classList.remove('bg-yellow-50', 'bg-green-50');
        retrainStatus.classList.add('bg-red-50');
        retrainStatus.querySelector('svg').classList.remove('text-yellow-600', 'text-green-600');
        retrainStatus.querySelector('svg').classList.add('text-red-600');
        retrainBadge.classList.remove('bg-yellow-500', 'bg-green-500');
        retrainBadge.classList.add('bg-red-500');
        retrainBadge.textContent = 'Desconectado';
    }
}

// Verificar estado de la API al cargar la página
checkApiStatus();

// Evaluación individual
evaluateButton.addEventListener('click', async () => {
    try {
        // Validar el JSON
        const jsonText = jsonInput.value.trim();
        if (!jsonText && !selectedEvalJsonFile) {
            throw new Error('Por favor, ingresa datos JSON válidos o sube un archivo JSON');
        }
        
        let jsonData;
        
        if (jsonText) {
            // Usar el texto JSON ingresado
            jsonData = JSON.parse(jsonText);
            if (!jsonData.data || !Array.isArray(jsonData.data)) {
                throw new Error('El JSON debe contener un array "data"');
            }
<<<<<<< HEAD
            
            // Ocultar mensajes de error
            evalError.classList.add('hidden');
            
            // Enviar datos al endpoint de predicción
            try {
                const response = await fetch('http://127.0.0.1:8000 /predict/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: jsonText,
                });
                
                if (!response.ok) {
                    throw new Error(`Error en la respuesta: ${response.status}`);
                }
                
                const result = await response.json();
                parsedData = result;
                currentIndex = 0;
                
                // Mostrar resultados
                displayResult();
                resultContainer.classList.remove('hidden');
                resultContainer.classList.add('fade-in');
            } catch (fetchErr) {
                throw new Error(`Error al comunicarse con el servidor: ${fetchErr.message}`);
            }
        } catch (err) {
            // Mostrar mensaje de error
            evalErrorMessage.textContent = err.message;
            evalError.classList.remove('hidden');
            resultContainer.classList.add('hidden');
        }
    });
    
    // Mostrar resultado actual
    function displayResult() {
        if (!parsedData || !parsedData.data || parsedData.data.length === 0) {
            resultContainer.classList.add('hidden');
            return;
        }
        
        const item = parsedData.data[currentIndex];
        
        // Actualizar elementos
        resultTitle.textContent = item.Titulo;
        resultMeta.textContent = `ID: ${item.ID} | Fecha: ${item.Fecha}`;
        resultDescription.textContent = item.Descripcion;
        
        // Actualizar etiqueta
        if (item.Label === 1) {
            resultLabel.textContent = 'Verdadera';
            resultLabel.classList.remove('bg-red-500');
            resultLabel.classList.add('bg-green-500');
        } else {
            resultLabel.textContent = 'Falsa';
            resultLabel.classList.remove('bg-green-500');
            resultLabel.classList.add('bg-red-500');
        }
        
        // Actualizar contador
        currentIndexElement.textContent = currentIndex + 1;
        totalItemsElement.textContent = parsedData.data.length;
        
        // Actualizar estado de los botones
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === parsedData.data.length - 1;
    }
    
    // Botones de navegación
    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            displayResult();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (parsedData && currentIndex < parsedData.data.length - 1) {
            currentIndex++;
            displayResult();
        }
    });
    
    // Reentrada de datos - Selección de archivo
    fileUpload.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            selectedFile = e.target.files[0];
            
            // Validar tipo de archivo
            if (selectedFile.type !== 'application/json') {
                uploadErrorMessage.textContent = 'Por favor, selecciona un archivo JSON válido';
                uploadError.classList.remove('hidden');
                fileInfo.classList.add('hidden');
                fileValid.classList.add('hidden');
                uploadButton.disabled = true;
                previewContainer.classList.add('hidden');
                selectedFile = null;
                return;
            }
            
            // Mostrar información del archivo
            fileName.textContent = selectedFile.name;
            fileSize.textContent = (selectedFile.size / 1024).toFixed(2);
            fileInfo.classList.remove('hidden');
            
            // Ocultar mensajes de error
            uploadError.classList.add('hidden');
            
            // Leer y validar el archivo
=======
        } else if (selectedEvalJsonFile) {
            // Usar el archivo JSON subido
>>>>>>> 8dae0e7862bb6c8188a25c89d6e21ce76d86a4ec
            const reader = new FileReader();
            jsonData = await new Promise((resolve, reject) => {
                reader.onload = (event) => {
                    try {
                        const content = event.target.result;
                        const parsed = JSON.parse(content);
                        if (!parsed.data || !Array.isArray(parsed.data)) {
                            reject(new Error('El JSON debe contener un array "data"'));
                        } else {
                            resolve(parsed);
                        }
                    } catch (err) {
                        reject(new Error('Error al analizar el JSON. Asegúrate de que el formato sea correcto.'));
                    }
                };
                reader.onerror = () => reject(new Error('Error al leer el archivo'));
                reader.readAsText(selectedEvalJsonFile);
            });
        }
        
        // Ocultar mensajes de error
        evalError.classList.add('hidden');
        
        // Preparar datos para la solicitud
        const requestData = {
            data: jsonData.data
        };
        
<<<<<<< HEAD
        previewItems.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'border-b';
            
            // ID
            const idCell = document.createElement('td');
            idCell.className = 'p-2';
            idCell.textContent = item.ID;
            row.appendChild(idCell);
            
            // Etiqueta
            const labelCell = document.createElement('td');
            labelCell.className = 'p-2';
            const labelBadge = document.createElement('span');
            labelBadge.className = `px-2 py-1 text-xs font-medium rounded-full text-white ${item.Label === 1 ? 'bg-green-500' : 'bg-red-500'}`;
            labelBadge.textContent = item.Label === 1 ? 'Verdadera' : 'Falsa';
            labelCell.appendChild(labelBadge);
            row.appendChild(labelCell);
            
            // Título
            const titleCell = document.createElement('td');
            titleCell.className = 'p-2 truncate max-w-[300px]';
            titleCell.textContent = item.Titulo;
            row.appendChild(titleCell);
            
            // Fecha
            const dateCell = document.createElement('td');
            dateCell.className = 'p-2';
            dateCell.textContent = item.Fecha;
            row.appendChild(dateCell);
            
            previewTableBody.appendChild(row);
        });
        
        // Mostrar mensaje de "más registros" si hay más de 3
        if (data.data.length > 3) {
            previewMore.textContent = `... y ${data.data.length - 3} registros más`;
            previewMore.classList.remove('hidden');
        } else {
            previewMore.classList.add('hidden');
        }
        
        // Mostrar contenedor de vista previa
        previewContainer.classList.remove('hidden');
        previewContainer.classList.add('fade-in');
    }
    
    // Subir archivo
    uploadButton.addEventListener('click', async () => {
        if (!selectedFile) return;
        
        // Iniciar proceso de subida
        uploadButton.disabled = true;
        uploadProgressContainer.classList.remove('hidden');
        uploadSuccess.classList.add('hidden');
        
        // Reiniciar barra de progreso
        uploadProgressBar.style.width = '0%';
        
        try {
            // Simular progreso inicial
            const progressInterval = setInterval(() => {
                const currentWidth = parseInt(uploadProgressBar.style.width, 10);
                if (currentWidth >= 90) {
                    clearInterval(progressInterval);
                } else {
                    uploadProgressBar.style.width = (currentWidth + 10) + '%';
                }
            }, 300);
            
            // Crear FormData
            const formData = new FormData();
            formData.append('file', selectedFile);
            
            // Enviar archivo al endpoint de reentrenamiento
            const response = await fetch('http://127.0.0.1:8000 /retrain/', {
                method: 'POST',
                body: formData,
=======
        // Si hay un modelo cargado, incluirlo en la solicitud
        if (selectedEvalModelFile) {
            const reader = new FileReader();
            const modelData = await new Promise((resolve, reject) => {
                reader.onload = (event) => {
                    try {
                        const content = event.target.result;
                        resolve(JSON.parse(content));
                    } catch (err) {
                        reject(new Error('Error al analizar el modelo JSON'));
                    }
                };
                reader.onerror = () => reject(new Error('Error al leer el archivo del modelo'));
                reader.readAsText(selectedEvalModelFile);
>>>>>>> 8dae0e7862bb6c8188a25c89d6e21ce76d86a4ec
            });
            
            requestData.model = modelData;
        }
        
        // Enviar datos al endpoint de predicción
        try {
            const response = await fetch('http://localhost:8000/predict/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });
            
            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.status}`);
            }
            
            const result = await response.json();
            parsedData = result;
            currentIndex = 0;
            
            // Mostrar resultados
            displayResult();
            updateResultsSummary();
            resultContainer.classList.remove('hidden');
            resultContainer.classList.add('fade-in');
        } catch (fetchErr) {
            console.error("Error en fetch:", fetchErr);
            throw new Error(`Error al comunicarse con el servidor: ${fetchErr.message}`);
        }
    } catch (err) {
        // Mostrar mensaje de error
        evalErrorMessage.textContent = err.message;
        evalError.classList.remove('hidden');
        resultContainer.classList.add('hidden');
    }
});

// Mostrar resultado actual
function displayResult() {
    if (!parsedData || !parsedData.data || parsedData.data.length === 0) {
        resultContainer.classList.add('hidden');
        return;
    }
    
    const item = parsedData.data[currentIndex];
    
    // Actualizar elementos
    resultTitle.textContent = item.Titulo;
    resultMeta.textContent = `ID: ${item.ID} | Fecha: ${item.Fecha}`;
    resultDescription.textContent = item.Descripcion;
    
    // Actualizar etiqueta original
    if (item.Label === 1) {
        resultLabel.textContent = 'Verdadera';
        resultLabel.classList.remove('bg-red-500');
        resultLabel.classList.add('bg-green-500');
    } else {
        resultLabel.textContent = 'Falsa';
        resultLabel.classList.remove('bg-green-500');
        resultLabel.classList.add('bg-red-500');
    }
    
    // Actualizar predicción
    if (item.Prediction === 1) {
        resultPrediction.textContent = 'Verdadera';
        resultPrediction.classList.remove('bg-red-500');
        resultPrediction.classList.add('bg-blue-500');
    } else {
        resultPrediction.textContent = 'Falsa';
        resultPrediction.classList.remove('bg-blue-500');
        resultPrediction.classList.add('bg-red-500');
    }
    
    // Actualizar barra de probabilidad
    if (item.Probability !== undefined) {
        const probability = parseFloat(item.Probability) * 100;
        probabilityBar.style.width = `${probability}%`;
    } else {
        probabilityBar.style.width = '0%';
    }
    
    // Actualizar contador
    currentIndexElement.textContent = currentIndex + 1;
    totalItemsElement.textContent = parsedData.data.length;
    
    // Actualizar estado de los botones
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === parsedData.data.length - 1;
}

// Actualizar resumen de resultados
function updateResultsSummary() {
    if (!parsedData || !parsedData.data || parsedData.data.length === 0) {
        return;
    }
    
    const total = parsedData.data.length;
    let correct = 0;
    
    parsedData.data.forEach(item => {
        if (item.Label === item.Prediction) {
            correct++;
        }
    });
    
    const accuracyValue = (correct / total * 100).toFixed(2);
    
    totalNews.textContent = total;
    correctPredictions.textContent = correct;
    accuracy.textContent = `${accuracyValue}%`;
}

// Botones de navegación
prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        displayResult();
    }
});

nextButton.addEventListener('click', () => {
    if (parsedData && currentIndex < parsedData.data.length - 1) {
        currentIndex++;
        displayResult();
    }
});

// Reentrada de datos - Selección de archivo
fileUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        selectedFile = e.target.files[0];
        
        // Validar tipo de archivo
        if (selectedFile.type !== 'application/json') {
            uploadErrorMessage.textContent = 'Por favor, selecciona un archivo JSON válido';
            uploadError.classList.remove('hidden');
            fileInfo.classList.add('hidden');
            fileValid.classList.add('hidden');
            uploadButton.disabled = true;
            previewContainer.classList.add('hidden');
            selectedFile = null;
            return;
        }
        
        // Mostrar información del archivo
        fileName.textContent = selectedFile.name;
        fileSize.textContent = (selectedFile.size / 1024).toFixed(2);
        fileInfo.classList.remove('hidden');
        
        // Ocultar mensajes de error
        uploadError.classList.add('hidden');
        
        // Leer y validar el archivo
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                const parsed = JSON.parse(content);
                
                if (!parsed.data || !Array.isArray(parsed.data)) {
                    throw new Error('El JSON debe contener un array "data"');
                }
                
                // Mostrar mensaje de validación
                fileValidMessage.textContent = `Se han encontrado ${parsed.data.length} registros en el archivo JSON.`;
                fileValid.classList.remove('hidden');
                
                // Habilitar botón de subida
                uploadButton.disabled = false;
                
                // Mostrar vista previa
                displayPreview(parsed);
            } catch (err) {
                uploadErrorMessage.textContent = 'Error al analizar el JSON. Asegúrate de que el formato sea correcto.';
                uploadError.classList.remove('hidden');
                fileValid.classList.add('hidden');
                uploadButton.disabled = true;
                previewContainer.classList.add('hidden');
            }
        };
        
        reader.onerror = () => {
            uploadErrorMessage.textContent = 'Error al leer el archivo';
            uploadError.classList.remove('hidden');
            fileValid.classList.add('hidden');
            uploadButton.disabled = true;
            previewContainer.classList.add('hidden');
        };
        
        reader.readAsText(selectedFile);
    }
});

// Mostrar vista previa de los datos
function displayPreview(data) {
    if (!data || !data.data || data.data.length === 0) {
        previewContainer.classList.add('hidden');
        return;
    }
    
    // Limpiar tabla
    previewTableBody.innerHTML = '';
    
    // Mostrar hasta 3 registros
    const previewItems = data.data.slice(0, 3);
    
    previewItems.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-b';
        
        // ID
        const idCell = document.createElement('td');
        idCell.className = 'p-2';
        idCell.textContent = item.ID;
        row.appendChild(idCell);
        
        // Etiqueta
        const labelCell = document.createElement('td');
        labelCell.className = 'p-2';
        const labelBadge = document.createElement('span');
        labelBadge.className = `px-2 py-1 text-xs font-medium rounded-full text-white ${item.Label === 1 ? 'bg-green-500' : 'bg-red-500'}`;
        labelBadge.textContent = item.Label === 1 ? 'Verdadera' : 'Falsa';
        labelCell.appendChild(labelBadge);
        row.appendChild(labelCell);
        
        // Título
        const titleCell = document.createElement('td');
        titleCell.className = 'p-2 truncate max-w-[300px]';
        titleCell.textContent = item.Titulo;
        row.appendChild(titleCell);
        
        // Fecha
        const dateCell = document.createElement('td');
        dateCell.className = 'p-2';
        dateCell.textContent = item.Fecha;
        row.appendChild(dateCell);
        
        previewTableBody.appendChild(row);
    });
    
    // Mostrar mensaje de "más registros" si hay más de 3
    if (data.data.length > 3) {
        previewMore.textContent = `... y ${data.data.length - 3} registros más`;
        previewMore.classList.remove('hidden');
    } else {
        previewMore.classList.add('hidden');
    }
    
    // Mostrar contenedor de vista previa
    previewContainer.classList.remove('hidden');
    previewContainer.classList.add('fade-in');
}

// Subir archivo para reentrenamiento
uploadButton.addEventListener('click', async () => {
    if (!selectedFile) return;
    
    // Iniciar proceso de subida
    uploadButton.disabled = true;
    uploadProgressContainer.classList.remove('hidden');
    uploadSuccess.classList.add('hidden');
    
    // Reiniciar barra de progreso
    uploadProgressBar.style.width = '0%';
    
    try {
        // Simular progreso inicial
        const progressInterval = setInterval(() => {
            const currentWidth = parseInt(uploadProgressBar.style.width, 10);
            if (currentWidth >= 90) {
                clearInterval(progressInterval);
            } else {
                uploadProgressBar.style.width = (currentWidth + 10) + '%';
            }
        }, 300);
        
        // Leer el archivo como texto
        const fileContent = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(selectedFile);
        });
        
        // Parsear el JSON
        const jsonData = JSON.parse(fileContent);
        
        // Enviar los datos como JSON directamente en lugar de FormData
        const response = await fetch('http://localhost:8000/retrain/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        });
        
        clearInterval(progressInterval);
        
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        
        // Completar barra de progreso
        uploadProgressBar.style.width = '100%';
        
        // Mostrar mensaje de éxito
        setTimeout(() => {
            uploadProgressContainer.classList.add('hidden');
            uploadSuccess.classList.remove('hidden');
        }, 500);
        
        // Obtener la respuesta del servidor
        const result = await response.json();
        console.log('Respuesta del servidor:', result);
        
        // Mostrar resultados del entrenamiento si están disponibles
        if (result.metrics) {
            displayTrainingResults(result.metrics);
        }
        
    } catch (err) {
        console.error("Error en upload:", err);
        uploadErrorMessage.textContent = `Error al subir el archivo: ${err.message}`;
        uploadError.classList.remove('hidden');
        uploadProgressContainer.classList.add('hidden');
        uploadButton.disabled = false;
    }
});

// Mostrar resultados del entrenamiento
function displayTrainingResults(metrics) {
    const trainingResults = document.getElementById('training-results');
    
    // Actualizar métricas
    document.getElementById('training-accuracy').textContent = `${(metrics.accuracy * 100).toFixed(2)}%`;
    document.getElementById('training-precision').textContent = `${(metrics.precision * 100).toFixed(2)}%`;
    document.getElementById('training-recall').textContent = `${(metrics.recall * 100).toFixed(2)}%`;
    document.getElementById('training-f1').textContent = `${(metrics.f1_score * 100).toFixed(2)}%`;
    
    // Actualizar información del modelo
    document.getElementById('model-version').textContent = '1.0.0';
    document.getElementById('training-date').textContent = new Date().toLocaleString();
    document.getElementById('samples-count').textContent = metrics.samples_count;
    
    // Mostrar matriz de confusión
    const confusionMatrix = document.getElementById('confusion-matrix');
    confusionMatrix.innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-center">
            <div class="bg-green-100 p-2 font-medium">VP: ${metrics.confusion_matrix[0][0]}</div>
            <div class="bg-red-100 p-2 font-medium">FP: ${metrics.confusion_matrix[0][1]}</div>
            <div class="bg-red-100 p-2 font-medium">FN: ${metrics.confusion_matrix[1][0]}</div>
            <div class="bg-green-100 p-2 font-medium">VN: ${metrics.confusion_matrix[1][1]}</div>
        </div>
    `;
    
    // Mostrar distribución de clases
    const classDistribution = document.getElementById('class-distribution');
    classDistribution.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    classDistribution.appendChild(canvas);
    
    new Chart(canvas, {
        type: 'pie',
        data: {
            labels: ['Verdaderas', 'Falsas'],
            datasets: [{
                data: [metrics.class_distribution.true, metrics.class_distribution.false],
                backgroundColor: ['#10B981', '#EF4444'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
    
    // Mostrar resultados
    trainingResults.classList.remove('hidden');
}

// Drag and drop para la zona de subida de archivos
const dropZones = document.querySelectorAll('.border-dashed');

dropZones.forEach(dropZone => {
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            // Determinar qué input de archivo debe recibir los archivos
            if (dropZone.closest('#content-individual')) {
                evalJsonFile.files = e.dataTransfer.files;
                const event = new Event('change', { bubbles: true });
                evalJsonFile.dispatchEvent(event);
            } else if (dropZone.closest('#content-reentry')) {
                fileUpload.files = e.dataTransfer.files;
                const event = new Event('change', { bubbles: true });
                fileUpload.dispatchEvent(event);
            } else if (dropZone.closest('#content-evaluate')) {
                evalFileUpload.files = e.dataTransfer.files;
                const event = new Event('change', { bubbles: true });
                evalFileUpload.dispatchEvent(event);
            }
        }
    });
});

// Evaluación de modelo - Selección de archivo
evalFileUpload.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        selectedEvalFile = e.target.files[0];
        
        // Validar tipo de archivo
        if (selectedEvalFile.type !== 'application/json') {
            evalUploadErrorMessage.textContent = 'Por favor, selecciona un archivo JSON válido';
            evalUploadError.classList.remove('hidden');
            evalFileInfo.classList.add('hidden');
            evalFileValid.classList.add('hidden');
            evalButton.disabled = true;
            selectedEvalFile = null;
            return;
        }
        
        // Mostrar información del archivo
        evalFileName.textContent = selectedEvalFile.name;
        evalFileSize.textContent = (selectedEvalFile.size / 1024).toFixed(2);
        evalFileInfo.classList.remove('hidden');
        
        // Ocultar mensajes de error
        evalUploadError.classList.add('hidden');
        
        // Leer y validar el archivo
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                const parsed = JSON.parse(content);
                
                if (!parsed.data || !Array.isArray(parsed.data)) {
                    throw new Error('El JSON debe contener un array "data"');
                }
                
                // Mostrar mensaje de validación
                evalFileValidMessage.textContent = `Se han encontrado ${parsed.data.length} registros en el archivo JSON.`;
                evalFileValid.classList.remove('hidden');
                
                // Habilitar botón de evaluación
                evalButton.disabled = false;
            } catch (err) {
                evalUploadErrorMessage.textContent = 'Error al analizar el JSON. Asegúrate de que el formato sea correcto.';
                evalUploadError.classList.remove('hidden');
                evalFileValid.classList.add('hidden');
                evalButton.disabled = true;
            }
        };
        
        reader.onerror = () => {
            evalUploadErrorMessage.textContent = 'Error al leer el archivo';
            evalUploadError.classList.remove('hidden');
            evalFileValid.classList.add('hidden');
            evalButton.disabled = true;
        };
        
        reader.readAsText(selectedEvalFile);
    }
});

// Evaluación de modelo - Botón evaluar
evalButton.addEventListener('click', async () => {
    if (!selectedEvalFile) return;
    
    // Iniciar proceso de evaluación
    evalButton.disabled = true;
    evalProgressContainer.classList.remove('hidden');
    evalResults.classList.add('hidden');
    
    // Reiniciar barra de progreso
    evalProgressBar.style.width = '0%';
    
    try {
        // Simular progreso inicial
        const progressInterval = setInterval(() => {
            const currentWidth = parseInt(evalProgressBar.style.width, 10);
            if (currentWidth >= 90) {
                clearInterval(progressInterval);
            } else {
                evalProgressBar.style.width = (currentWidth + 10) + '%';
            }
        }, 300);
        
        // Leer el archivo como texto
        const fileContent = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(selectedEvalFile);
        });
        
        // Parsear el JSON
        const jsonData = JSON.parse(fileContent);
        
        // Preparar datos para la solicitud
        let formData = new FormData();
        formData.append('file', new Blob([JSON.stringify(jsonData)], {type: 'application/json'}));
        
        // Si hay un modelo específico seleccionado, incluirlo
        if (selectedModelFile) {
            const modelContent = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = (e) => reject(e);
                reader.readAsText(selectedModelFile);
            });
            
            formData.append('model_file', new Blob([modelContent], {type: 'application/json'}));
        }
        
        // Enviar archivo al endpoint de evaluación
        const response = await fetch('http://localhost:8000/evaluate/', {
            method: 'POST',
            body: formData,
        });
        
        clearInterval(progressInterval);
        
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        
        // Completar barra de progreso
        evalProgressBar.style.width = '100%';
        
        // Obtener resultados
        const result = await response.json();
        console.log('Resultados de evaluación:', result);
        
        // Mostrar resultados
        displayEvaluationResults(result);
        
        // Ocultar progreso y mostrar resultados
        setTimeout(() => {
            evalProgressContainer.classList.add('hidden');
            evalResults.classList.remove('hidden');
        }, 500);
        
    } catch (err) {
        console.error("Error en evaluación:", err);
        evalUploadErrorMessage.textContent = `Error al evaluar el modelo: ${err.message}`;
        evalUploadError.classList.remove('hidden');
        evalProgressContainer.classList.add('hidden');
        evalButton.disabled = false;
    }
});

// Mostrar resultados de evaluación
function displayEvaluationResults(results) {
    // Actualizar métricas
    document.getElementById('eval-accuracy').textContent = `${(results.accuracy * 100).toFixed(2)}%`;
    document.getElementById('eval-precision').textContent = `${(results.precision * 100).toFixed(2)}%`;
    document.getElementById('eval-recall').textContent = `${(results.recall * 100).toFixed(2)}%`;
    document.getElementById('eval-f1').textContent = `${(results.f1_score * 100).toFixed(2)}%`;
    document.getElementById('eval-samples-count').textContent = results.samples_count;
    
    // Mostrar matriz de confusión
    const confusionMatrix = document.getElementById('eval-confusion-matrix');
    confusionMatrix.innerHTML = `
        <div class="grid grid-cols-2 gap-2 text-center">
            <div class="bg-green-100 p-2 font-medium">VP: ${results.confusion_matrix[0][0]}</div>
            <div class="bg-red-100 p-2 font-medium">FP: ${results.confusion_matrix[0][1]}</div>
            <div class="bg-red-100 p-2 font-medium">FN: ${results.confusion_matrix[1][0]}</div>
            <div class="bg-green-100 p-2 font-medium">VN: ${results.confusion_matrix[1][1]}</div>
        </div>
    `;
    
    // Mostrar distribución de clases
    const classDistribution = document.getElementById('eval-class-distribution');
    classDistribution.innerHTML = '';
    
    const canvas = document.createElement('canvas');
    classDistribution.appendChild(canvas);
    
    new Chart(canvas, {
        type: 'pie',
        data: {
            labels: ['Verdaderas', 'Falsas'],
            datasets: [{
                data: [results.class_distribution.true, results.class_distribution.false],
                backgroundColor: ['#10B981', '#EF4444'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

// Modal de información del modelo
modelInfoButton.addEventListener('click', async () => {
    modelInfoModal.classList.remove('hidden');
    
    // Cargar información del modelo
    try {
        modelInfoContent.innerHTML = `
            <div class="flex justify-center items-center h-20">
                <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        `;
        
        const response = await fetch('http://localhost:8000/model-info/');
        
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        
        const modelInfo = await response.json();
        
        // Mostrar información del modelo
        modelInfoContent.innerHTML = `
            <div class="space-y-4">
                <div>
                    <h4 class="font-medium mb-2">Información General</h4>
                    <div class="space-y-2">
                        <div>
                            <p class="text-sm text-gray-500">Versión:</p>
                            <p class="font-medium">${modelInfo.version || 'No disponible'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Fecha de entrenamiento:</p>
                            <p class="font-medium">${modelInfo.training_date || 'No disponible'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Muestras utilizadas:</p>
                            <p class="font-medium">${modelInfo.samples_count || 'No disponible'}</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-medium mb-2">Métricas</h4>
                    <div class="space-y-2">
                        <div>
                            <p class="text-sm text-gray-500">Exactitud:</p>
                            <p class="font-medium">${modelInfo.accuracy ? `${(modelInfo.accuracy * 100).toFixed(2)}%` : 'No disponible'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Precisión:</p>
                            <p class="font-medium">${modelInfo.precision ? `${(modelInfo.precision * 100).toFixed(2)}%` : 'No disponible'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">Recall:</p>
                            <p class="font-medium">${modelInfo.recall ? `${(modelInfo.recall * 100).toFixed(2)}%` : 'No disponible'}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-500">F1-Score:</p>
                            <p class="font-medium">${modelInfo.f1_score ? `${(modelInfo.f1_score * 100).toFixed(2)}%` : 'No disponible'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error("Error al cargar información del modelo:", err);
        modelInfoContent.innerHTML = `
            <div class="p-4 border border-red-200 bg-red-50 rounded-md text-red-800">
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-600 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span class="font-bold">Error</span>
                </div>
                <p class="mt-2">No se pudo cargar la información del modelo. ${err.message}</p>
            </div>
        `;
    }
});

// Cerrar modal
closeModal.addEventListener('click', () => {
    modelInfoModal.classList.add('hidden');
});

// Cerrar modal al hacer clic fuera
modelInfoModal.addEventListener('click', (e) => {
    if (e.target === modelInfoModal) {
        modelInfoModal.classList.add('hidden');
    }
});

// Exportar modelo
exportModelButton.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:8000/export-model/');
        
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        
        const modelData = await response.json();
        
        // Crear un blob con los datos del modelo
        const blob = new Blob([JSON.stringify(modelData, null, 2)], { type: 'application/json' });
        
        // Crear un enlace para descargar el archivo
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `modelo_noticias_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
        
    } catch (err) {
        console.error("Error al exportar modelo:", err);
        alert(`Error al exportar el modelo: ${err.message}`);
    }
});

// Exportar modelo recién entrenado
exportTrainedModel.addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:8000/export-model/');
        
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        
        const modelData = await response.json();
        
        // Crear un blob con los datos del modelo
        const blob = new Blob([JSON.stringify(modelData, null, 2)], { type: 'application/json' });
        
        // Crear un enlace para descargar el archivo
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `modelo_noticias_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        
        // Limpiar
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
        
    } catch (err) {
        console.error("Error al exportar modelo:", err);
        alert(`Error al exportar el modelo: ${err.message}`);
    }
});

// Importar modelo
importModelFile.addEventListener('change', async (e) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        
        // Validar tipo de archivo
        if (file.type !== 'application/json') {
            alert('Por favor, selecciona un archivo JSON válido');
            return;
        }
        
        try {
            // Leer el archivo
            const reader = new FileReader();
            const modelData = await new Promise((resolve, reject) => {
                reader.onload = (event) => {
                    try {
                        const content = event.target.result;
                        resolve(JSON.parse(content));
                    } catch (err) {
                        reject(new Error('Error al analizar el JSON del modelo'));
                    }
                };
                reader.onerror = () => reject(new Error('Error al leer el archivo del modelo'));
                reader.readAsText(file);
            });
            
            // Enviar el modelo al servidor
            const response = await fetch('http://localhost:8000/import-model/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(modelData),
            });
            
            if (!response.ok) {
                throw new Error(`Error en la respuesta: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Mostrar mensaje de éxito
            alert('Modelo importado correctamente');
            
            // Recargar información del modelo
            modelInfoButton.click();
            
        } catch (err) {
            console.error("Error al importar modelo:", err);
            alert(`Error al importar el modelo: ${err.message}`);
        }
    }
});

// Cargar modelo para evaluación individual
evalModelFile.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        selectedEvalModelFile = e.target.files[0];
        
        // Validar tipo de archivo
        if (selectedEvalModelFile.type !== 'application/json') {
            alert('Por favor, selecciona un archivo JSON válido para el modelo');
            evalModelName.textContent = '';
            selectedEvalModelFile = null;
            return;
        }
        
        // Mostrar nombre del archivo
        evalModelName.textContent = selectedEvalModelFile.name;
    }
});

// Cargar modelo específico para evaluación
evalSpecificModelFile.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        selectedModelFile = e.target.files[0];
        
        // Validar tipo de archivo
        if (selectedModelFile.type !== 'application/json') {
            alert('Por favor, selecciona un archivo JSON válido para el modelo');
            evalSpecificModelName.textContent = '';
            selectedModelFile = null;
            return;
        }
        
        // Mostrar nombre del archivo
        evalSpecificModelName.textContent = selectedModelFile.name;
    }
});

// Cargar archivo JSON para evaluación individual
evalJsonFile.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        selectedEvalJsonFile = e.target.files[0];
        
        // Validar tipo de archivo
        if (selectedEvalJsonFile.type !== 'application/json') {
            alert('Por favor, selecciona un archivo JSON válido');
            evalJsonInfo.classList.add('hidden');
            selectedEvalJsonFile = null;
            return;
        }
        
        // Mostrar información del archivo
        evalJsonName.textContent = selectedEvalJsonFile.name;
        evalJsonSize.textContent = (selectedEvalJsonFile.size / 1024).toFixed(2);
        evalJsonInfo.classList.remove('hidden');
        
        // Limpiar el textarea
        jsonInput.value = '';
    }
});
});