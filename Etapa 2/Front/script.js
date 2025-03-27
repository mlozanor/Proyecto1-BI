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
    const currentIndexElement = document.getElementById('current-index');
    const totalItemsElement = document.getElementById('total-items');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
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
    
    // Variables para el estado de la API
    const predictStatus = document.getElementById('predict-status');
    const predictBadge = document.getElementById('predict-badge');
    const retrainStatus = document.getElementById('retrain-status');
    const retrainBadge = document.getElementById('retrain-badge');
    
    // Variables globales
    let parsedData = null;
    let currentIndex = 0;
    let selectedFile = null;
    
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
    });
    
    // Verificar estado de la API
    async function checkApiStatus() {
        // Verificar endpoint de predicción
        try {
            const predictResponse = await fetch('http://0.0.0.0:8000/predict/', {
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
            const retrainResponse = await fetch('http://0.0.0.0:8000/retrain/', {
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
            if (!jsonText) {
                throw new Error('Por favor, ingresa datos JSON válidos');
            }
            
            const parsed = JSON.parse(jsonText);
            if (!parsed.data || !Array.isArray(parsed.data)) {
                throw new Error('El JSON debe contener un array "data"');
            }
            
            // Ocultar mensajes de error
            evalError.classList.add('hidden');
            
            // Enviar datos al endpoint de predicción
            try {
                const response = await fetch('http://0.0.0.0:8000/predict/', {
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
            const response = await fetch('http://0.0.0.0:8000/retrain/', {
                method: 'POST',
                body: formData,
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
            
            // Opcional: obtener la respuesta del servidor
            const result = await response.json();
            console.log('Respuesta del servidor:', result);
            
        } catch (err) {
            uploadErrorMessage.textContent = `Error al subir el archivo: ${err.message}`;
            uploadError.classList.remove('hidden');
            uploadProgressContainer.classList.add('hidden');
            uploadButton.disabled = false;
        }
    });
    
    // Drag and drop para la zona de subida de archivos
    const dropZone = document.querySelector('.border-dashed');
    
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
            fileUpload.files = e.dataTransfer.files;
            const event = new Event('change', { bubbles: true });
            fileUpload.dispatchEvent(event);
        }
    });
});