from transformers import *
from sklearn.pipeline import Pipeline

def DroppingStage():
    return Pipeline([
        ("drop_bad", DropIrrelevant("Timestamp")),
        ("replace_inf", ReplaceInfinites())
    ])

def LabelCreationStage():
    return Pipeline([
        ("create_labels", CreateLabelColumns()),
        ("split_labeled", SplitLabeledDatasets())
    ])

def LabelEncodingStage(label):
    return Pipeline([
        ("drop_LF_labels", DropLowFrequencyLabels(label_column=label)),
        ("labeling_output", CustomLabelEncoder()),
    ])

def FeaturesSelectionnStage(threshold, label):
    return Pipeline([
        ("remove_zero_var_features", DropZeroVar(label)),
        ("remove_duplicates", RemoveDuplicates()),
        ("feature_selection", CustomFeatureSelect(threshold, label)),
    ])

def SplittingStage():
    return Pipeline([
        ("remove_duplicates", RemoveDuplicates()),
        ("split_train_test", SplitTrainTest())
    ])

def NormalizerStage(label):
    return Pipeline([
        ("normalize", Normalizer(label)),
    ])