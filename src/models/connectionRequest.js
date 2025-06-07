const mongoose = require("mongoose");
const { Schema } = mongoose;

const connnectionRequestSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["ignored", "interested", "rejected", "accepted"],
      message: `{Value} is of incorrect status type`,
    },
  },
  {
    timestamps: true,
  }
);

connnectionRequestSchema.index({ toUserId: 1, fromUserId: 1 });

connnectionRequestSchema.pre("save", function (next) {
  const data = this;

  if (data.fromUserId.equals(this.toUserId)) {
    throw new Error("User cant send request to himeself");
  }

  next();
});

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connnectionRequestSchema
);

module.exports = {
  ConnectionRequestModel,
};
