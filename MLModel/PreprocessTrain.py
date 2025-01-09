from Stages import *

class PreprocessTrain():

    def init(self):
        self.drop_stage = DroppingStage()
        self.split_stage = SplittingStage()
        self.normalize_stage_binary = NormalizerStage("BinaryLabel")
        self.normalize_stage_multi = NormalizerStage("MultiLabel")
        self.create_stage = LabelCreationStage()
        self.label_stage_binary = LabelEncodingStage("BinaryLabel")
        self.label_stage_multi = LabelEncodingStage("MultiLabel")
        self.feature_stage_binary = FeaturesSelectionnStage(0.18, "BinaryLabel")
        self.feature_stage_multi = FeaturesSelectionnStage(0.18, "MultiLabel")

    def fit_train(self, data):

        data = self.drop_stage.fit_transform(data)

        Binary, Multi = self.create_stage.fit_transform(data)

        # -----------------------------------------------------------

        Binary = self.label_stage_binary.fit_transform(Binary)
        Multi = self.label_stage_multi.fit_transform(Multi)

        # -------------------------------------------------------------

        Binary = self.feature_stage_binary.fit_transform(Binary)
        Multi = self.feature_stage_multi.fit_transform(Multi)

        # -------------------------------------------------------------

        BinaryTrain, BinaryTest = self.split_stage.fit_transform(Binary)
        MultiTrain, MultiTest = self.split_stage.fit_transform(Multi)

        BinaryTrain = self.normalize_stage_binary.fit_transform(BinaryTrain)
        BinaryTest = self.normalize_stage_binary.transform(BinaryTest)

        MultiTrain = self.normalize_stage_multi.fit_transform(MultiTrain)
        MultiTest = self.normalize_stage_multi.transform(MultiTest)

        return BinaryTrain, BinaryTest, MultiTrain, MultiTest


    def fit_test(self, data):
        data = self.drop_stage.transform(data)

        self.feature_stage_binary.named_steps["feature_selection"].set_train_mode(train=False)
        self.feature_stage_multi.named_steps["feature_selection"].set_train_mode(train=False)

        Binary = self.feature_stage_binary.transform(data)
        Multi = self.feature_stage_multi.transform(data)

        self.normalize_stage_binary.named_steps["normalize"].set_train_mode(train=False)
        self.normalize_stage_multi.named_steps["normalize"].set_train_mode(train=False)

        Binary = self.normalize_stage_binary.transform(Binary)
        Multi = self.normalize_stage_multi.transform(Multi)

        return Binary, Multi

    def getBinaryLabelMapping(self):
        return self.label_stage_binary.named_steps["labeling_output"].get_label_mapping()

    def getMultiLabelMapping(self):
        return self.label_stage_multi.named_steps["labeling_output"].get_label_mapping()