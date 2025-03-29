from fastapi import FastAPI, UploadFile, File, HTTPException, Form, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
import pickle
import os
from datetime import datetime
import logging
from typing import Optional
import joblib

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos
    allow_headers=["*"],  # Permitir todos los headers
)

# Rutas para los archivos del modelo
MODEL_DIR = "models"
VECTORIZER_PATH = os.path.join(MODEL_DIR, "vectorizer.pkl")
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
MODEL_INFO_PATH = os.path.join(MODEL_DIR, "model_info.json")

# Crear directorio de modelos si no existe
os.makedirs(MODEL_DIR, exist_ok=True)

# Variables globales para el modelo y vectorizador
vectorizer = None
model = None
model_info = {
    "version": "1.0.0",
    "training_date": datetime.now().isoformat(),
    "samples_count": 0,
    "accuracy": 0.0,
    "precision": 0.0,
    "recall": 0.0,
    "f1_score": 0.0,
    "confusion_matrix": [[0, 0], [0, 0]],
    "class_distribution": {"true": 0, "false": 0}
}

# Cargar modelo y vectorizador si existen
def load_model():
    global vectorizer, model, model_info
    try:
        if os.path.exists(VECTORIZER_PATH) and os.path.exists(MODEL_PATH):
            vectorizer = joblib.load(VECTORIZER_PATH)
            model = joblib.load(MODEL_PATH)
            logger.info("Modelo y vectorizador cargados correctamente")
            
            # Cargar información del modelo
            if os.path.exists(MODEL_INFO_PATH):
                with open(MODEL_INFO_PATH, 'r') as f:
                    model_info = json.load(f)
                logger.info("Información del modelo cargada correctamente")
            return True
        else:
            logger.warning("No se encontraron archivos del modelo. Se usará un modelo nuevo cuando se entrene.")
            return False
    except Exception as e:
        logger.error(f"Error al cargar el modelo: {str(e)}")
        return False

# Guardar modelo y vectorizador
def save_model():
    try:
        joblib.dump(vectorizer, VECTORIZER_PATH)
        joblib.dump(model, MODEL_PATH)
        
        # Guardar información del modelo
        with open(MODEL_INFO_PATH, 'w') as f:
            json.dump(model_info, f)
        
        logger.info("Modelo, vectorizador e información guardados correctamente")
        return True
    except Exception as e:
        logger.error(f"Error al guardar el modelo: {str(e)}")
        return False

# Intentar cargar el modelo al iniciar
load_model()

@app.get("/")
def read_root():
    return {"message": "API de Evaluación de Noticias"}

@app.get("/predict/")
def check_predict():
    if model is None or vectorizer is None:
        return JSONResponse(
            status_code=200,
            content={"status": "warning", "message": "Modelo no entrenado. Por favor, entrene el modelo primero."}
        )
    return {"status": "ok", "message": "Endpoint de predicción disponible"}

@app.post("/predict/")
async def predict(request: Request):
    global model, vectorizer
    
    # Verificar si el modelo está cargado
    if model is None or vectorizer is None:
        raise HTTPException(status_code=400, detail="Modelo no entrenado. Por favor, entrene el modelo primero.")
    
    try:
        # Intentar leer el cuerpo de la solicitud como JSON
        data = await request.json()
        
        # Verificar si se proporcionó un modelo personalizado
        custom_model = None
        if "model" in data:
            try:
                custom_model_data = data["model"]
                # Crear un modelo temporal con los datos proporcionados
                custom_vectorizer = TfidfVectorizer()
                custom_model = LogisticRegression()
                
                # Configurar el vectorizador con el vocabulario y los valores IDF
                if "model_data" in custom_model_data and "vectorizer" in custom_model_data["model_data"]:
                    vectorizer_data = custom_model_data["model_data"]["vectorizer"]
                    custom_vectorizer.vocabulary_ = vectorizer_data.get("vocabulary", {})
                    custom_vectorizer.idf_ = np.array(vectorizer_data.get("idf", []))
                
                # Configurar el modelo con los pesos y el intercepto
                if "model_data" in custom_model_data and "classifier" in custom_model_data["model_data"]:
                    classifier_data = custom_model_data["model_data"]["classifier"]
                    custom_model.coef_ = np.array([classifier_data.get("weights", [])])
                    custom_model.intercept_ = np.array([classifier_data.get("intercept", 0)])
                    custom_model.classes_ = np.array(classifier_data.get("classes", [0, 1]))
                
                # Usar el modelo personalizado para la predicción
                temp_vectorizer = custom_vectorizer
                temp_model = custom_model
                logger.info("Usando modelo personalizado para la predicción")
            except Exception as e:
                logger.error(f"Error al cargar el modelo personalizado: {str(e)}")
                raise HTTPException(status_code=400, detail=f"Error al cargar el modelo personalizado: {str(e)}")
        else:
            # Usar el modelo global
            temp_vectorizer = vectorizer
            temp_model = model
        
        # Verificar si hay datos para predecir
        if "data" not in data or not isinstance(data["data"], list) or len(data["data"]) == 0:
            raise HTTPException(status_code=400, detail="No se proporcionaron datos válidos para la predicción")
        
        # Procesar cada noticia
        results = []
        for item in data["data"]:
            # Verificar campos requeridos
            if "Titulo" not in item or "Descripcion" not in item:
                continue
            
            # Preparar texto para la predicción
            text = f"{item['Titulo']} {item['Descripcion']}"
            
            # Vectorizar el texto
            text_vectorized = temp_vectorizer.transform([text])
            
            # Realizar predicción
            prediction = int(temp_model.predict(text_vectorized)[0])
            probability = float(temp_model.predict_proba(text_vectorized)[0][1])
            
            # Agregar resultados
            result_item = {
                "ID": item.get("ID", ""),
                "Titulo": item["Titulo"],
                "Descripcion": item["Descripcion"],
                "Fecha": item.get("Fecha", ""),
                "Label": item.get("Label", None),  # Etiqueta original si está disponible
                "Prediction": prediction,  # Predicción del modelo
                "Probability": probability  # Probabilidad de la clase positiva
            }
            results.append(result_item)
        
        logger.info(f"Predicción realizada para {len(results)} noticias")
        return {"data": results}
    
    except json.JSONDecodeError:
        logger.error("Error al decodificar JSON")
        raise HTTPException(status_code=400, detail="Error al decodificar JSON. Asegúrese de enviar un JSON válido.")
    except Exception as e:
        logger.error(f"Error en la predicción: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error en la predicción: {str(e)}")

@app.get("/retrain/")
def check_retrain():
    return {"status": "ok", "message": "Endpoint de reentrenamiento disponible"}

@app.post("/retrain/")
async def retrain(request: Request, file: Optional[UploadFile] = File(None)):
    global vectorizer, model, model_info
    
    try:
        # Determinar si los datos vienen como archivo o como JSON en el cuerpo
        if file:
            # Leer datos del archivo
            contents = await file.read()
            data = json.loads(contents)
        else:
            # Leer datos del cuerpo de la solicitud
            data = await request.json()
        
        # Verificar si hay datos para entrenar
        if "data" not in data or not isinstance(data["data"], list) or len(data["data"]) == 0:
            raise HTTPException(status_code=400, detail="No se proporcionaron datos válidos para el entrenamiento")
        
        # Preparar datos para el entrenamiento
        texts = []
        labels = []
        
        for item in data["data"]:
            # Verificar campos requeridos
            if "Titulo" not in item or "Descripcion" not in item or "Label" not in item:
                continue
            
            # Preparar texto y etiqueta
            text = f"{item['Titulo']} {item['Descripcion']}"
            label = int(item["Label"])
            
            texts.append(text)
            labels.append(label)
        
        if len(texts) == 0:
            raise HTTPException(status_code=400, detail="No se encontraron datos válidos para el entrenamiento")
        
        # Crear y entrenar el vectorizador
        vectorizer = TfidfVectorizer(max_features=5000)
        X = vectorizer.fit_transform(texts)
        
        # Crear y entrenar el modelo
        model = LogisticRegression(max_iter=1000)
        model.fit(X, labels)
        
        # Evaluar el modelo
        predictions = model.predict(X)
        
        # Calcular métricas
        accuracy = accuracy_score(labels, predictions)
        precision = precision_score(labels, predictions, zero_division=0)
        recall = recall_score(labels, predictions, zero_division=0)
        f1 = f1_score(labels, predictions, zero_division=0)
        cm = confusion_matrix(labels, predictions).tolist()
        
        # Actualizar información del modelo
        model_info = {
            "version": "1.0.0",
            "training_date": datetime.now().isoformat(),
            "samples_count": len(texts),
            "accuracy": float(accuracy),
            "precision": float(precision),
            "recall": float(recall),
            "f1_score": float(f1),
            "confusion_matrix": cm,
            "class_distribution": {
                "true": int(sum(labels)),
                "false": int(len(labels) - sum(labels))
            }
        }
        
        # Guardar modelo
        save_model()
        
        logger.info(f"Modelo reentrenado con {len(texts)} muestras. Accuracy: {accuracy:.4f}")
        
        # Devolver resultados
        return {
            "status": "success",
            "message": "Modelo reentrenado correctamente",
            "metrics": {
                "accuracy": float(accuracy),
                "precision": float(precision),
                "recall": float(recall),
                "f1_score": float(f1),
                "samples_count": len(texts),
                "confusion_matrix": cm,
                "class_distribution": {
                    "true": int(sum(labels)),
                    "false": int(len(labels) - sum(labels))
                }
            }
        }
    
    except json.JSONDecodeError:
        logger.error("Error al decodificar JSON")
        raise HTTPException(status_code=400, detail="Error al decodificar JSON. Asegúrese de enviar un JSON válido.")
    except Exception as e:
        logger.error(f"Error en el reentrenamiento: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error en el reentrenamiento: {str(e)}")

@app.post("/evaluate/")
async def evaluate(request: Request, file: Optional[UploadFile] = File(None), model_file: Optional[UploadFile] = File(None)):
    global model, vectorizer
    
    try:
        # Determinar si los datos vienen como archivo o como JSON en el cuerpo
        if file:
            # Leer datos del archivo
            contents = await file.read()
            data = json.loads(contents)
        else:
            # Leer datos del cuerpo de la solicitud
            data = await request.json()
        
        # Verificar si hay datos para evaluar
        if "data" not in data or not isinstance(data["data"], list) or len(data["data"]) == 0:
            raise HTTPException(status_code=400, detail="No se proporcionaron datos válidos para la evaluación")
        
        # Determinar qué modelo usar
        temp_vectorizer = None
        temp_model = None
        
        if model_file:
            # Usar modelo proporcionado en la solicitud
            model_contents = await model_file.read()
            model_data = json.loads(model_contents)
            
            # Crear un modelo temporal con los datos proporcionados
            temp_vectorizer = TfidfVectorizer()
            temp_model = LogisticRegression()
            
            # Configurar el vectorizador con el vocabulario y los valores IDF
            if "model_data" in model_data and "vectorizer" in model_data["model_data"]:
                vectorizer_data = model_data["model_data"]["vectorizer"]
                temp_vectorizer.vocabulary_ = vectorizer_data.get("vocabulary", {})
                temp_vectorizer.idf_ = np.array(vectorizer_data.get("idf", []))
            
            # Configurar el modelo con los pesos y el intercepto
            if "model_data" in model_data and "classifier" in model_data["model_data"]:
                classifier_data = model_data["model_data"]["classifier"]
                temp_model.coef_ = np.array([classifier_data.get("weights", [])])
                temp_model.intercept_ = np.array([classifier_data.get("intercept", 0)])
                temp_model.classes_ = np.array(classifier_data.get("classes", [0, 1]))
            
            logger.info("Usando modelo proporcionado para la evaluación")
        else:
            # Verificar si el modelo global está cargado
            if model is None or vectorizer is None:
                raise HTTPException(status_code=400, detail="Modelo no entrenado. Por favor, entrene el modelo primero.")
            
            # Usar el modelo global
            temp_vectorizer = vectorizer
            temp_model = model
            logger.info("Usando modelo global para la evaluación")
        
        # Preparar datos para la evaluación
        texts = []
        labels = []
        
        for item in data["data"]:
            # Verificar campos requeridos
            if "Titulo" not in item or "Descripcion" not in item or "Label" not in item:
                continue
            
            # Preparar texto y etiqueta
            text = f"{item['Titulo']} {item['Descripcion']}"
            label = int(item["Label"])
            
            texts.append(text)
            labels.append(label)
        
        if len(texts) == 0:
            raise HTTPException(status_code=400, detail="No se encontraron datos válidos para la evaluación")
        
        # Vectorizar los textos
        X = temp_vectorizer.transform(texts)
        
        # Realizar predicciones
        predictions = temp_model.predict(X)
        
        # Calcular métricas
        accuracy = accuracy_score(labels, predictions)
        precision = precision_score(labels, predictions, zero_division=0)
        recall = recall_score(labels, predictions, zero_division=0)
        f1 = f1_score(labels, predictions, zero_division=0)
        cm = confusion_matrix(labels, predictions).tolist()
        
        logger.info(f"Evaluación realizada con {len(texts)} muestras. Accuracy: {accuracy:.4f}")
        
        # Devolver resultados
        return {
            "status": "success",
            "message": "Evaluación completada correctamente",
            "accuracy": float(accuracy),
            "precision": float(precision),
            "recall": float(recall),
            "f1_score": float(f1),
            "samples_count": len(texts),
            "confusion_matrix": cm,
            "class_distribution": {
                "true": int(sum(labels)),
                "false": int(len(labels) - sum(labels))
            }
        }
    
    except json.JSONDecodeError:
        logger.error("Error al decodificar JSON")
        raise HTTPException(status_code=400, detail="Error al decodificar JSON. Asegúrese de enviar un JSON válido.")
    except Exception as e:
        logger.error(f"Error en la evaluación: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error en la evaluación: {str(e)}")

@app.get("/model-info/")
def get_model_info():
    global model_info
    
    if model is None or vectorizer is None:
        return JSONResponse(
            status_code=200,
            content={"status": "warning", "message": "Modelo no entrenado. Por favor, entrene el modelo primero."}
        )
    
    return model_info

@app.get("/export-model/")
def export_model():
    global model, vectorizer, model_info
    
    if model is None or vectorizer is None:
        raise HTTPException(status_code=400, detail="Modelo no entrenado. Por favor, entrene el modelo primero.")
    
    try:
        # Extraer información del vectorizador
        vectorizer_data = {
            "vocabulary": vectorizer.vocabulary_,
            "idf": vectorizer.idf_.tolist() if hasattr(vectorizer, 'idf_') else [],
            "stop_words": list(vectorizer.stop_words_) if hasattr(vectorizer, 'stop_words_') else []
        }
        
        # Extraer información del modelo
        model_data = {
            "weights": model.coef_[0].tolist() if hasattr(model, 'coef_') else [],
            "intercept": float(model.intercept_[0]) if hasattr(model, 'intercept_') else 0,
            "classes": model.classes_.tolist() if hasattr(model, 'classes_') else [0, 1]
        }
        
        # Crear estructura del modelo exportado
        exported_model = {
            "model_info": model_info,
            "model_data": {
                "vectorizer": vectorizer_data,
                "classifier": model_data
            }
        }
        
        logger.info("Modelo exportado correctamente")
        return exported_model
    
    except Exception as e:
        logger.error(f"Error al exportar el modelo: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al exportar el modelo: {str(e)}")

@app.post("/import-model/")
async def import_model(request: Request):
    global model, vectorizer, model_info
    
    try:
        # Leer datos del modelo
        model_data = await request.json()
        
        # Verificar estructura del modelo
        if "model_data" not in model_data or "vectorizer" not in model_data["model_data"] or "classifier" not in model_data["model_data"]:
            raise HTTPException(status_code=400, detail="Estructura del modelo inválida")
        
        # Extraer información del modelo
        vectorizer_data = model_data["model_data"]["vectorizer"]
        classifier_data = model_data["model_data"]["classifier"]
        
        # Crear nuevo vectorizador
        new_vectorizer = TfidfVectorizer()
        new_vectorizer.vocabulary_ = vectorizer_data.get("vocabulary", {})
        new_vectorizer.idf_ = np.array(vectorizer_data.get("idf", []))
        
        # Crear nuevo modelo
        new_model = LogisticRegression()
        new_model.coef_ = np.array([classifier_data.get("weights", [])])
        new_model.intercept_ = np.array([classifier_data.get("intercept", 0)])
        new_model.classes_ = np.array(classifier_data.get("classes", [0, 1]))
        
        # Actualizar modelo global
        vectorizer = new_vectorizer
        model = new_model
        
        # Actualizar información del modelo
        if "model_info" in model_data:
            model_info = model_data["model_info"]
        
        # Guardar modelo
        save_model()
        
        logger.info("Modelo importado correctamente")
        return {"status": "success", "message": "Modelo importado correctamente"}
    
    except json.JSONDecodeError:
        logger.error("Error al decodificar JSON")
        raise HTTPException(status_code=400, detail="Error al decodificar JSON. Asegúrese de enviar un JSON válido.")
    except Exception as e:
        logger.error(f"Error al importar el modelo: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al importar el modelo: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)