# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# import joblib
# import pickle
# import xgboost as xgb
# from PreprocessTrain import PreprocessTrain
# from Stages import *
#
# app = Flask(__name__)
# CORS(app)
#
# # Load models
# CIC_Binary = joblib.load("models/binary.pkl")
# CIC_Multi = joblib.load("models/multi.pkl")
# with open('models/pipeline.pkl', 'rb') as file:
#     pipeline = pickle.load(file)
#
#
# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part in the request"}), 400
#
#     if CIC_Binary is None or CIC_Multi is None:
#         return jsonify({"error": "Models not loaded"}), 500
#
#     file = request.files['file']
#
#     try:
#         data = pd.read_csv(file)
#         print(data.shape)
#         binary, multi = pipeline.fit_test(data)
#         print(binary.shape)
#         print(multi.shape)
#
#     # Perform binary classification
#         binary_predictions = CIC_Binary.predict(binary)
#
#     # If all binary predictions are 1, return "No Attacks Occurred"
#         if all(binary_predictions):
#             return jsonify({"message": "No Attacks Occurred"})
#
#     # Identify indices where binary predictions indicate an attack (value = 0)
#         attack_indices = [i for i, pred in enumerate(binary_predictions) if pred == 0]
#
#     # Extract the data corresponding to the identified attack indices
#         attack_data = multi.iloc[attack_indices]
#
#     # Perform multi-class classification on the extracted data
#         multi_predictions = CIC_Multi.predict(attack_data)
#
#     # Fetch label mappings for binary and multi-class predictions
#     #     binaryLabels = pipeline.getBinaryLabelMapping()
#
#         multiLabels = pipeline.getMultiLabelMapping()
#         mapped_predictions = [multiLabels[pred] for pred in multi_predictions]
#
#         return jsonify({
#             "multi_predictions": mapped_predictions
#         })
#
#
#
# # Return predictions in JSON format
# #         return jsonify({
# #         "binary_predictions": binary_predictions.tolist(),
# #         "multi_predictions": mapped_multi_predictions,
# #         "binaryLabels":binaryLabels,
# #         "multiLabels":multiLabels
# #         })
#
#
#
#         # binary_predictions = CIC_Binary.predict(binary)
#         #
#         # if any(binary_predictions):
#         #     return jsonify({"message": "No attacks occurred"})
#         #
#         # attack_indices = [i for i, pred in enumerate(binary_predictions) if pred == 0]
#         # attack_data = multi.iloc[attack_indices]
#         # multi_predictions = CIC_Multi.predict(attack_data)
#         #
#         # print(multi_predictions)
#         #
#         # binaryLabels = pipeline.getBinaryLabelMapping()
#         # multiLabels = pipeline.getMultiLabelMapping()
#         #
#         # return jsonify({
#         #     "binary_predictions": binary_predictions.tolist(),
#         #     "multi_predictions": multi_predictions.tolist()
#         # })
#
#     except KeyError as e:
#         missing_columns = list(set(e.args[0].split(" ")[-1]) - set(data.columns))
#         return jsonify({"error": f"Missing required columns: {missing_columns}"}), 400
#
#     except Exception as e:
#         print(f"Error during prediction: {str(e)}")
#         return jsonify({"error": str(e)}), 500
#
#
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)
#
#



from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import pickle
import xgboost as xgb
from PreprocessTrain import PreprocessTrain
from Stages import *
app = Flask(__name__)
CORS(app)

# Load models
CIC_Binary = joblib.load("models/binary.pkl")
CIC_Multi = joblib.load("models/multi.pkl")
with open('models/pipeline.pkl', 'rb') as file:
    pipeline = pickle.load(file)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    if CIC_Binary is None or CIC_Multi is None:
        return jsonify({"error": "Models not loaded"}), 500

    file = request.files['file']

    try:
        data = pd.read_csv(file)
        print(data.shape)
        binary, multi = pipeline.fit_test(data)
        print(binary.shape)
        print(multi.shape)

        # Perform binary classification
        binary_predictions = CIC_Binary.predict(binary)

        # If all binary predictions are 1, return "No Attacks Occurred"
        if all(binary_predictions):
            return jsonify({"message": "No Attacks Occurred"})

        # Identify indices where binary predictions indicate an attack (value = 0)
        attack_indices = [i for i, pred in enumerate(binary_predictions) if pred == 0]

        # Extract the data corresponding to the identified attack indices
        attack_data = multi.iloc[attack_indices]

        multi_predictions = CIC_Multi.predict(attack_data)
        multiLabels = pipeline.getMultiLabelMapping()
        binaryLabels = pipeline.getBinaryLabelMapping()

        return jsonify({
            "multi_predictions": multi_predictions.tolist(),
            "binary_predictions": binary_predictions.tolist(),
            "binaryLabels":binaryLabels,
            "multiLabels":multiLabels,
        })

    except KeyError as e:
        missing_columns = list(set(e.args[0].split(" ")[-1]) - set(data.columns))
        return jsonify({"error": f"Missing required columns: {missing_columns}"}), 400

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)