from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Union
import pickle
import pandas as pd

#  Cargar el pipeline previamente entrenado
with open("pipeline_model.pkl", "rb") as f:
    pipeline = pickle.load(f)

#  Crear la aplicación FastAPI
app = FastAPI()

#  Definir el esquema de datos de entrada (aceptar texto y números)
class InputData(BaseModel):
    data: List[Dict[str, Union[str, int, float, None]]]

#  Endpoint para predicción
@app.post("/predict/")
async def predict(input_data: InputData):
    try:
        # 🔥 Convertir los datos de entrada a un DataFrame
        df = pd.DataFrame(input_data.data)
        
        #  Reemplazar valores nulos con cadena vacía
        df = df.fillna("")

        #  Convertir todos los valores a texto para evitar errores de tipo
        df = df.astype(str)

        #  Si el modelo solo usa ciertas columnas, seleccionarlas
        if 'Titulo' in df.columns and 'Descripcion' in df.columns:
            text_data = df['Titulo'] + " " + df['Descripcion']
        else:
            raise HTTPException(status_code=400, detail="Faltan columnas de texto ('Titulo', 'Descripcion')")

        #  Convertir los valores de tipo numpy.ndarray a texto explícitamente
        text_data = text_data.apply(lambda x: x if isinstance(x, str) else str(x))
        
        #  Si el modelo usa un vectorizador (como TfidfVectorizer), transformarlo
        if hasattr(pipeline, "transform"):
            X = pipeline.transform(text_data)
        else:
            X = text_data
        
        #  Realizar predicciones
        predictions = pipeline.predict(X)
        
        #  Si el modelo permite predict_proba, obtener las probabilidades
        if hasattr(pipeline, "predict_proba"):
            probabilities = pipeline.predict_proba(X).tolist()
        else:
            probabilities = None
        
        #  Construir la respuesta
        response = [
            {
                "prediction": int(predictions[i]),
                "probability": probabilities[i] if probabilities else None
            }
            for i in range(len(predictions))
        ]
        
        return response
    
    except Exception as e:
        #  Capturar cualquier error y devolverlo como detalle en la respuesta
        raise HTTPException(status_code=400, detail=str(e))

#  Ejecutar el servidor con:
# uvicorn main:app --host 0.0.0.0 --port 8000
