from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import xgboost as xgb

app = Flask(__name__)
CORS(app)

# Load models
CIC_Binary = joblib.load("models/xgb_binary.pkl")
CIC_Multi = joblib.load("models/xgb_multi.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    if CIC_Binary is None or CIC_Multi is None:
        return jsonify({"error": "No model uploaded"}), 400

    file = request.files['file']
    predictionType = request.form.get("predictionType")  # Retrieve predictionType from the request

    try:
        # Load the uploaded CSV
        data = pd.read_csv(file)

        # Drop unnecessary columns
        data = data.loc[:, ~data.columns.str.contains('^Unnamed')]

        # Retrieve feature names directly from the model
        binary_features = CIC_Binary.feature_names
        multi_features = CIC_Multi.feature_names

        # Align data with the appropriate model's expected features
        if predictionType == "binary":
            data = data[binary_features]  # Select only binary model's features
            dmatrix = xgb.DMatrix(data)
            predictions = CIC_Binary.predict(dmatrix)
        elif predictionType == "multi":
            data = data[multi_features]  # Select only multi model's features
            dmatrix = xgb.DMatrix(data)
            predictions = CIC_Multi.predict(dmatrix)
        else:
            return jsonify({"error": "Invalid prediction type provided."}), 400

        return jsonify({"predictions": predictions.tolist()})
    except KeyError as e:
        missing_columns = list(set(e.args[0].split(" ")[-1]) - set(data.columns))
        return jsonify({"error": f"Missing required columns: {missing_columns}"}), 400
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

