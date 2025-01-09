# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import pandas as pd
# import joblib
# import xgboost as xgb
#
# app = Flask(__name__)
# CORS(app)
#
# # Load models
# CIC_Binary = joblib.load("models/xgb_binary.pkl")
# CIC_Multi = joblib.load("models/xgb_multi.pkl")
#
# @app.route('/predict', methods=['POST'])
# def predict():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part in the request"}), 400
#
#     if CIC_Binary is None or CIC_Multi is None:
#         return jsonify({"error": "No model uploaded"}), 400
#
#     file = request.files['file']
#     predictionType = request.form.get("predictionType")  # Retrieve predictionType from the request
#
#     try:
#         # Load the uploaded CSV
#         data = pd.read_csv(file)
#
#         # Drop unnecessary columns
#         data = data.loc[:, ~data.columns.str.contains('^Unnamed')]
#
#         # Retrieve feature names directly from the model
#         binary_features = CIC_Binary.feature_names
#         multi_features = CIC_Multi.feature_names
#
#         # Align data with the appropriate model's expected features
#         if predictionType == "binary":
#             data = data[binary_features]  # Select only binary model's features
#             dmatrix = xgb.DMatrix(data)
#             predictions = CIC_Binary.predict(dmatrix)
#         elif predictionType == "multi":
#             data = data[multi_features]  # Select only multi model's features
#             dmatrix = xgb.DMatrix(data)
#             predictions = CIC_Multi.predict(dmatrix)
#         else:
#             return jsonify({"error": "Invalid prediction type provided."}), 400
#
#         return jsonify({"predictions": predictions.tolist()})
#     except KeyError as e:
#         missing_columns = list(set(e.args[0].split(" ")[-1]) - set(data.columns))
#         return jsonify({"error": f"Missing required columns: {missing_columns}"}), 400
#     except Exception as e:
#         print(f"Error during prediction: {str(e)}")
#         return jsonify({"error": str(e)}), 500
#
# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000)
#


from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import xgboost as xgb
from PreprocessTrain import PreprocessTrain

app = Flask(__name__)
CORS(app)

# Load models
CIC_Binary = joblib.load("models/binary.pkl")
CIC_Multi = joblib.load("models/multi.pkl")
pipeline = joblib.load("models/pipeline.pkl")
print(type(pipeline))
print(dir(pipeline))

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    if CIC_Binary is None or CIC_Multi is None:
        return jsonify({"error": "Models not loaded"}), 500

    file = request.files['file']

    try:
        # Load the uploaded CSV
        data = pd.read_csv(file)
        binary, multi= pipeline.fit_test(data)

        print(binary.shape)
        print(multi.shape)

        # Binary prediction stage
        binary_dmatrix = xgb.DMatrix(binary)
        binary_predictions = CIC_Binary.predict(binary_dmatrix)

        # Check if any attacks are detected
        if any(binary_predictions):
            return jsonify({"message": "No attacks occurred"})

        # Multi-class prediction stage
        attack_indices = [i for i, pred in enumerate(binary_predictions) if pred == 0]
        attack_data = multi.iloc[attack_indices]
        multi_dmatrix = xgb.DMatrix(attack_data)
        multi_predictions = CIC_Multi.predict(multi_dmatrix)

#         binaryLables = pipeline.getBinaryLabelMapping()
#         multiLables = pipeline.getMultiLabelMapping()


        return jsonify({
            "binary_predictions": binary_predictions.tolist(),
            "multi_predictions": multi_predictions.tolist()
        })



    except KeyError as e:
        missing_columns = list(set(e.args[0].split(" ")[-1]) - set(data.columns))
        return jsonify({"error": f"Missing required columns: {missing_columns}"}), 400
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
