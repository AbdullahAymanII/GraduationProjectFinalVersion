# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# import joblib
# import pickle
# import xgboost as xgb
# from PreprocessTrain import PreprocessTrain
# from Stages import *
# app = Flask(__name__)
# CORS(app)
#
# # Load models
# CIC_Binary = joblib.load("models/binary.pkl")
# CIC_Multi = joblib.load("models/multi.pkl")
# with open('models/pipeline.pkl', 'rb') as file:
#     pipeline = pickle.load(file)
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
#         # Perform binary classification
#         binary_predictions = CIC_Binary.predict(binary)
#
#         # If all binary predictions are 1, return "No Attacks Occurred"
#         if all(binary_predictions):
#             return jsonify({"message": "No Attacks Occurred"})
#
#         # Identify indices where binary predictions indicate an attack (value = 0)
#         attack_indices = [i for i, pred in enumerate(binary_predictions) if pred == 0]
#
#         # Extract the data corresponding to the identified attack indices
#         attack_data = multi.iloc[attack_indices]
#
#         multi_predictions = CIC_Multi.predict(attack_data)
#         multiLabels = pipeline.getMultiLabelMapping()
#         binaryLabels = pipeline.getBinaryLabelMapping()
#
#         return jsonify({
#             "multi_predictions": multi_predictions.tolist(),
#             "binary_predictions": binary_predictions.tolist(),
#             "binaryLabels":binaryLabels,
#             "multiLabels":multiLabels,
#         })
#
#     except KeyError as e:
#         missing_columns = list(set(e.args[0].split(" ")[-1]) - set(data.columns))
#         return jsonify({"error": f"Missing required columns: {missing_columns}"}), 400
#
#     except Exception as e:
#         print(f"Error during prediction: {str(e)}")
#         return jsonify({"error": str(e)}), 500
#
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)



# from flask import Flask, request, jsonify, send_file
# from flask_cors import CORS
# import pandas as pd
# import joblib
# import pickle
# import os
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
#         # Load uploaded dataset
#         data = pd.read_csv(file)
#         print(data.shape)
#
#         # Preprocess data using the pipeline
#         binary, multi = pipeline.fit_test(data)
#         print(binary.shape)
#         print(multi.shape)
#
#         # Perform binary classification
#         binary_predictions = CIC_Binary.predict(binary)
#
#         # If all binary predictions are benign (1), return "No Attacks Occurred"
#         if all(binary_predictions):
#             return jsonify({"message": "No Attacks Occurred"})
#
#         # Identify indices where binary predictions indicate an attack (value = 0)
#         attack_indices = [i for i, pred in enumerate(binary_predictions) if pred == 0]
#
#         # Extract the data corresponding to the identified attack indices
#         attack_data = multi.iloc[attack_indices]
#
#         # Perform multi-class classification on attack data
#         multi_predictions = CIC_Multi.predict(attack_data)
#
#         # Get label mappings
#         multiLabels = {"MultiLabel": pipeline.getMultiLabelMapping()}
#         binaryLabels = {"BinaryLabel": pipeline.getBinaryLabelMapping()}
#
#         # Map predictions back to labels
#         data['Binary_Predictions'] = [
#             binaryLabels["BinaryLabel"].get(pred, f"Unknown({pred})") for pred in binary_predictions
#         ]
#
#         # Add multi-class labels only for rows with attacks
#         data['Multi_Predictions'] = None
#         for idx, pred in zip(attack_indices, multi_predictions):
#             data.at[idx, 'Multi_Predictions'] = multiLabels["MultiLabel"].get(pred, f"Unknown({pred})")
#
#         # Save the labeled dataset to a CSV file
#         output_file = 'labeled_dataset.csv'
#         data.to_csv(output_file, index=False)
#
#         # Return both JSON response and CSV file link
#         response = {
#             "multi_predictions": multi_predictions.tolist(),
#             "binary_predictions": binary_predictions.tolist(),
#             "binaryLabels": binaryLabels,
#             "multiLabels": multiLabels,
#             "csv_file_url": f"http://{request.host}/download_csv"
#         }
#         return jsonify(response)
#
#     except KeyError as e:
#         if isinstance(e.args[0], str):
#             missing_columns = list(set(e.args[0].split(" ")[-1]) - set(data.columns))
#             return jsonify({"error": f"Missing required columns: {missing_columns}"}), 400
#         else:
#             return jsonify({"error": f"Unexpected KeyError: {e}"}), 400
#
#     except Exception as e:
#         print(f"Error during prediction: {str(e)}")
#         return jsonify({"error": str(e)}), 500
#
#
#
# @app.route('/download_csv', methods=['GET'])
# def download_csv():
#     try:
#         # Serve the labeled dataset CSV file
#         output_file = 'labeled_dataset.csv'
#         if os.path.exists(output_file):
#             return send_file(output_file, as_attachment=True)
#         else:
#             return jsonify({"error": "File not found"}), 404
#     except Exception as e:
#         print(f"Error during file download: {str(e)}")
#         return jsonify({"error": str(e)}), 500
#
#
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)



from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import joblib
import pickle
import os
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
        # Load uploaded dataset
        data = pd.read_csv(file)
        print(data.shape)

        # Preprocess data using the pipeline
        binary, multi = pipeline.fit_test(data)
        print(binary.shape)
        print(multi.shape)

        # Perform binary classification
        binary_predictions = CIC_Binary.predict(binary)

        # If all binary predictions are benign (1), return "No Attacks Occurred"
        if all(binary_predictions):
            return jsonify({"message": "No Attacks Occurred"})


        # return jsonify({"message": binary_predictions})

        # Identify indices where binary predictions indicate an attack (value = 0)
        attack_indices = [i for i, pred in enumerate(binary_predictions) if pred == 0]

        # Extract the data corresponding to the identified attack indices
        attack_data = multi.iloc[attack_indices]

        # Perform multi-class classification on attack data
        multi_predictions = CIC_Multi.predict(attack_data)

        # Get label mappings
        multiLabels = {"MultiLabel": pipeline.getMultiLabelMapping()}
        binaryLabels = {"BinaryLabel": pipeline.getBinaryLabelMapping()}

        # Map predictions back to labels
        multi['Binary_Predictions'] = [
            binaryLabels["BinaryLabel"].get(pred, f"Unknown({pred})") for pred in binary_predictions
        ]

        # Add multi-class labels only for rows with attacks
        multi['Multi_Predictions'] = None
        for idx, pred in zip(attack_indices, multi_predictions):
            multi.at[idx, 'Multi_Predictions'] = multiLabels["MultiLabel"].get(pred, f"Unknown({pred})")

        # Save the labeled dataset to a CSV file
        output_file = 'labeled_dataset.csv'
        multi.to_csv(output_file, index=False)

        # Return both JSON response and CSV file link
        response = {
            "multi_predictions": multi_predictions.tolist(),
            "binary_predictions": binary_predictions.tolist(),
            "binaryLabels": binaryLabels,
            "multiLabels": multiLabels,
            "csv_file_url": f"http://{request.host}/download_csv"
        }
        return jsonify(response)

    except KeyError as e:
        if isinstance(e.args[0], str):
            missing_columns = list(set(e.args[0].split(" ")[-1]) - set(data.columns))
            return jsonify({"error": f"Missing required columns: {missing_columns}"}), 400
        else:
            return jsonify({"error": f"Unexpected KeyError: {e}"}), 400

    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500



@app.route('/download_csv', methods=['GET'])
def download_csv():
    try:
        # Serve the labeled dataset CSV file
        output_file = 'labeled_dataset.csv'
        if os.path.exists(output_file):
            return send_file(output_file, as_attachment=True)
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        print(f"Error during file download: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)



