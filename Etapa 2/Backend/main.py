from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Union
import pandas as pd
import joblib
from sklearn.metrics import precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split

#  Cargar el pipeline completo
pipeline = joblib.load("pipeline_model.pkl")

#  Crear la aplicación FastAPI
app = FastAPI()

#  Modelo de entrada
class InputData(BaseModel):
    data: List[Dict[str, Union[str, int, float, None]]]

@app.post("/predict/")
async def predict(input_data: InputData):
    try:
        df = pd.DataFrame(input_data.data).fillna("")

        if not {'Titulo', 'Descripcion', 'Label'}.issubset(df.columns):
            raise HTTPException(status_code=400, detail="Faltan columnas requeridas: 'Titulo', 'Descripcion' y 'Label'")

        text_data = df["Titulo"] + " " + df["Descripcion"]
        labels = df["Label"].astype(int)

        predictions = pipeline.predict(text_data)
        probabilities = pipeline.predict_proba(text_data).tolist() if hasattr(pipeline, "predict_proba") else None

        response = []
        for i, row in df.iterrows():
            pred = int(predictions[i])
            real_label = int(labels[i])
            es_correcta = pred == real_label

            result = {
                "ID": row.get("ID"),
                "Titulo": row["Titulo"],
                "Label": real_label,
                "prediction": pred,
                "es_correcta": es_correcta,
                "probability": probabilities[i] if probabilities else None
            }
            response.append(result)

        return response

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

#  Endpoint para reentrenar con primeras 8 y probar con las últimas 2
@app.post("/retrain/")
async def retrain(input_data: InputData):
    try:
        df = pd.DataFrame(input_data.data).fillna("")

        # Validación
        if len(df) < 10:
            raise HTTPException(status_code=400, detail="Se requieren al menos 10 instancias (8 para entrenar y 2 para evaluar).")

        if not {'Titulo', 'Descripcion', 'Label'}.issubset(df.columns):
            raise HTTPException(status_code=400, detail="Faltan columnas requeridas: 'Titulo', 'Descripcion', 'Label'")

        #  Partición de los datos
        train_df, test_df = train_test_split(df, test_size=0.2, random_state=42)
        
        # Datos de entrenamiento
        X_train = train_df['Titulo'] + " " + train_df['Descripcion']
        y_train = train_df['Label'].astype(int)

        # Datos de prueba
        X_test = test_df['Titulo'] + " " + test_df['Descripcion']
        y_test = test_df['Label'].astype(int)

        #  Reentrenar el modelo
        pipeline.fit(X_train, y_train)

        #  Guardar el nuevo modelo
        joblib.dump(pipeline, "pipeline_model.pkl")

        #  Evaluación
        predictions = pipeline.predict(X_test)

        return {
            "precision": precision_score(y_test, predictions, average="weighted"),
            "recall": recall_score(y_test, predictions, average="weighted"),
            "f1_score": f1_score(y_test, predictions, average="weighted")
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))