import numpy as np
import pandas as pd
from scipy.stats import ks_2samp
from sklearn.decomposition import PCA
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from imblearn.under_sampling import RandomUnderSampler
from sklearn.feature_selection import VarianceThreshold
from sklearn.base import BaseEstimator, TransformerMixin

class DropIrrelevant(BaseEstimator, TransformerMixin):
    def __init__(self, labels=None, negLabels="Flow Duration"):
        self.labels = labels
        self.negLabels = negLabels

    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        print("Drop Irrelevant Step is running...")
        print("Columns: TimeStamp Will be Dropped")
        print("Rows: Any Sample contains NaN Values Will be Dropped")

        if self.labels is not None:
            X = X.drop(self.labels, axis=1).dropna(axis=0)
        X[self.negLabels] = X[self.negLabels].apply(lambda x: abs(x) if x != -np.inf else x)

        print("Irrelevant Columns/Samples Dropped")
        print("Drop Irrelevant Finished Sucessfully")
        print("==============================================")
        return X

class ReplaceInfinites(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        print("Replacing inf Values stage is running....")
        X = X.copy()
        numeric_cols = X.select_dtypes(include=[np.number]).columns
        X[numeric_cols] = X[numeric_cols].apply(self.replace_infinite_values)
        print("Values replaced successfully")
        print("====================================================")
        return X

    def replace_infinite_values(self, column):
        if np.isinf(column).any():
            column = pd.Series(column)

            finite_values = column[np.isfinite(column)]

            if len(finite_values) > 0:
                max_finite = finite_values.max()
                min_finite = finite_values.min()

                large_multiplier = 10
                small_multiplier = 10

                column = column.replace(np.inf, max_finite * large_multiplier)
                column = column.replace(-np.inf, min_finite * small_multiplier if min_finite < 0 else min_finite / small_multiplier)
            else:
                column = column.replace([np.inf, -np.inf], 0)
        return column

class RemoveDuplicates(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        print("Removing Duplicates stage is running.....")

        memory_before = X.memory_usage(deep=True).sum()
        print(f"Memory usage before removing duplicates: {memory_before / (1024 ** 3):.3f} GB")

        duplicates_count = X.duplicated().sum()
        duplicates_percentage = (duplicates_count / len(X)) * 100
        print(f"Percentage of duplicates before removal: {duplicates_percentage:.3f}%")

        k = X.drop_duplicates(keep='last')
        k.reset_index(inplace=True, drop=True)

        memory_after = k.memory_usage(deep=True).sum()
        print(f"Memory usage after removing duplicates: {memory_after / (1024 ** 3):.3f} GB")

        memory_diff = memory_before - memory_after
        print(f"Memory difference after removing duplicates: {memory_diff / (1024 ** 3):.3f} GB")

        print("Duplicates Dropped")
        print("====================================================")
        return k


class Normalizer(BaseEstimator, TransformerMixin):
    def __init__(self, label, train=True):
        self.scaler = StandardScaler()
        self.label = label
        self.numeric_cols = None
        self.train = train

    def fit(self, X, y=None):
        self.numeric_cols = X.drop(self.label, axis=1).columns
        print(self.numeric_cols)
        self.scaler.fit(X.drop(self.label, axis=1))
        return self

    def transform(self, X, y=None):
        print("Normalizing stage is running......")

        if self.train:
            X_numeric_scaled = pd.DataFrame(
                self.scaler.transform(X.drop(self.label, axis=1)),
                columns=self.numeric_cols,
                index=X.index
            )

            X_non_numeric = X[[self.label]]

            X_scaled = pd.concat([X_numeric_scaled, X_non_numeric], axis=1)

        else:
            X_scaled = pd.DataFrame(
                self.scaler.transform(X),
                columns=self.numeric_cols,
                index=X.index
            )

        print("Normalization Done Successfully")
        print("==============================================")
        return X_scaled

    def set_train_mode(self, train=True):
        self.train = train

class CreateLabelColumns(BaseEstimator, TransformerMixin):
    def __init__(self, label="Label"):
        self.label = label

    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        print("Creating Binary/Multi Label Columns")
        attack_classes = self.getAttackClasses(X)
        X = X.copy()
        X['BinaryLabel'] = X[self.label].isin(attack_classes).replace({True: 'Attack', False: 'Benign'})
        X["MultiLabel"] = X[self.label]
        print("Creating Labels Done Successfully")
        print("===================================================")
        return X.drop(self.label, axis=1)

    def getAttackClasses(self, X):
        return [label for label in X[self.label].unique() if label != "Benign"]

class SplitLabeledDatasets(BaseEstimator, TransformerMixin):
    def __init__(self, dos_label=None):
        self.dos_label = dos_label

    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        print("Splitting the data into Binary/Multi Labels")
        if self.dos_label:
            dataset1 = X.drop(["MultiLabel", "Type"], axis=1)
            dataset2 = X.drop(["BinaryLabel", "Type"], axis=1)
            dataset2 = dataset2[dataset2["MultiLabel"] != "Benign"]
            dataset3 = X.drop(["MultiLabel", "BinaryLabel"], axis=1)
            dataset3 = dataset3[dataset3["Type"] != "Benign"]
            print("Splitting Done Successfully")
            print("=========================================")
            return dataset1, dataset2, dataset3

        else:
            dataset1 = X.drop(["MultiLabel"], axis=1)
            dataset2 = X.drop(["BinaryLabel"], axis=1)
            dataset2 = dataset2[dataset2["MultiLabel"] != "Benign"]
            print("Splitting Done Successfully")
            print("=========================================")
            return dataset1, dataset2


class SplitTrainTest(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        print("Splitting Data into train/test is running")
        train, test = train_test_split(X, shuffle=True, test_size=0.01, random_state=42)
        print("Train/Test Datasets are splitted")
        print("=========================================")
        return train, test

class CustomFeatureSelect(BaseEstimator, TransformerMixin):
    def __init__(self, ks_threshold=0.10, label_column="Label", train=True):
        self.ks_threshold = ks_threshold
        self.label_column = label_column
        self.selected_features_ = None
        self.train = train

    def fit(self, X, y=None):
        print("Feature Selection Stage is running.....")

        if self.label_column not in X.columns:
            raise ValueError(f"The label column '{self.label_column}' must be in the dataset.")

        label_column = self.label_column
        class_labels = X[label_column].unique()
        ks_results = {}

        if len(class_labels) == 2:
            print("Performing KS test for binary classification...")
            class_0 = class_labels[0]
            class_1 = class_labels[1]

            for feature in X.columns.tolist():
                if feature != label_column:
                    values_0 = X[X[label_column] == class_0][feature]
                    values_1 = X[X[label_column] == class_1][feature]
                    ks_stat, p_value = ks_2samp(values_0, values_1)
                    ks_results[feature] = {'KS Statistic': ks_stat, 'P-value': p_value}

        else:
            print("Performing pairwise KS tests for multi-class classification...")
            for feature in X.columns.tolist():
                if feature != label_column:
                    max_ks_stat = 0
                    min_p_value = 1
                    for i in range(len(class_labels)):
                        for j in range(i + 1, len(class_labels)):
                            values_i = X[X[label_column] == class_labels[i]][feature]
                            values_j = X[X[label_column] == class_labels[j]][feature]
                            ks_stat, p_value = ks_2samp(values_i, values_j)
                            max_ks_stat = max(max_ks_stat, ks_stat)
                            min_p_value = min(min_p_value, p_value)
                    ks_results[feature] = {'Max KS Statistic': max_ks_stat, 'Min P-value': min_p_value}

        ks_df = pd.DataFrame(ks_results).T.sort_values(by='KS Statistic' if len(class_labels) == 2 else 'Max KS Statistic', ascending=False)

        print(ks_df)

        if len(class_labels) == 2:
            significant_features = ks_df[ks_df['P-value'] < 0.05]
            features = significant_features[significant_features["KS Statistic"] > self.ks_threshold].index.tolist()
        else:
            significant_features = ks_df[ks_df['Min P-value'] < 0.05]
            features = significant_features[significant_features["Max KS Statistic"] > self.ks_threshold].index.tolist()

        features.append(label_column)
        self.selected_features_ = features
        return self

    def transform(self, X):
        print("Feature Selection Stage Done Successfully")
        print("=========================================")
        if self.train:
            return X[self.selected_features_]
        else:
            features_without_label = [feat for feat in self.selected_features_ if feat in X.columns]
            return X[features_without_label]

    def set_train_mode(self, train=True):
        self.train = train

    def fit_transform(self, X, y=None):
        self.fit(X, y)
        return self.transform(X)


class CustomRandomUnderSampler(BaseEstimator, TransformerMixin):
    def __init__(self, sampling_strategy='auto', random_state=42):
        self.sampling_strategy = sampling_strategy
        self.random_state = random_state
        self.sampler_ = RandomUnderSampler(
            sampling_strategy=self.sampling_strategy,
            random_state=self.random_state
        )
        self.feature_names_in_ = None

    def fit(self, X, y):
        if hasattr(X, 'columns'):
            self.feature_names_in_ = X.columns.tolist()
        return self


    def transform(self, X, y):
        X_resampled, y_resampled = self.sampler_.fit_resample(X, y)

        if hasattr(X, 'columns') and self.feature_names_in_ is not None:
            if not isinstance(X_resampled, pd.DataFrame):
                X_resampled = pd.DataFrame(X_resampled, columns=self.feature_names_in_)

        y_resampled = pd.Series(y_resampled, name=y.name)

        return pd.concat([X_resampled, y_resampled], axis=1)

    def fit_transform(self, X, y):
        self.fit(X, y)
        return self.transform(X, y)

class CustomLabelEncoder(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.label_encoders = {}
        self.label_mappings = {}

    def fit(self, X, y=None):
        for col in X.columns:
            if X[col].dtype == object:
                le = LabelEncoder()
                le.fit(X[col])
                self.label_encoders[col] = le
                self.label_mappings[col] = {class_: index for index, class_ in enumerate(le.classes_)}
        return self

    def transform(self, X, y=None):
        print("Label Encoding Stage is running...")

        X_transformed = X.copy()
        for col, le in self.label_encoders.items():
            X_transformed[col] = le.transform(X[col])

        print("Label Encoding Stage Done Successfully")
        print("=========================================")
        return X_transformed

    def get_label_mapping(self):
        return self.label_mappings

    def fit_transform(self, X, y=None):
        self.fit(X)
        return self.transform(X)

class DropZeroVar(BaseEstimator, TransformerMixin):
    def __init__(self, target):
        self.columns = []
        self.target = target

    def fit(self, X, y=None):
        column_variance = X.drop([self.target], axis=1).var()
        self.columns = column_variance[column_variance == 0].index
        return self

    def transform(self, X, y=None):
        return X.drop(columns=self.columns)

class DropLowFrequencyLabels(BaseEstimator, TransformerMixin):
    def __init__(self, threshold=5000, label_column='Label'):
        self.threshold = threshold
        self.label_column = label_column

    def fit(self, X, y=None):
        print("Drop Low Frequency Stage is running...")
        self.valid_labels = X[self.label_column].value_counts()[lambda x: x >= self.threshold].index
        return self

    def transform(self, X, y=None):
        X = X[X[self.label_column].isin(self.valid_labels)].reset_index(drop=True)
        print("Drop Low Frequency Stage Done Successfully")
        print("=========================================")
        return X

class GroupLabels(BaseEstimator, TransformerMixin):
    def __init__(self, label, dos_label="Type"):
        self.label = label
        self.dos_label = dos_label

    def fit(self, X, y=None):
        print("Group Labels Stage is running...")
        return self

    def transform(self, X, y=None):
        def group_labels(label):
            if "UDP" in label:
                return "UDP"
            elif "TCP" in label:
                return "TCP"
            elif "SYN" in label:
                return "SYN"
            elif "ICMP" in label:
                return "ICMP"
            elif "MQTT" in label:
                return "MQTT"
            elif "Recon" in label:
                return "Reconnaissance"
            elif "Spoofing" in label:
                return "Spoofing"
            elif "Malformed" in label:
                return "Malformed_Data"
            elif "Benign" in label:
                return "Benign"
            else:
                return "Unknown"

        def group_dos(label):
            if "DDoS" in label:
                return "DDoS"
            elif "DoS" in label:
                return "DoS"
            elif "Benign" in label:
                return "Benign"
            else:
                return "None"

        if isinstance(X, pd.DataFrame):
            X[self.dos_label] = X[self.label].apply(group_dos)
            X[self.label] = X[self.label].apply(group_labels)
            print("Group Labels Stage Done Successfully")
            print("=========================================")
            print(X["Type"].value_counts())
            return X

        else:
            raise ValueError("Input should be a pandas DataFrame with a 'Labels' column.")