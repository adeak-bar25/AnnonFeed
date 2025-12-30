import Mongoose from "mongoose";
import { generateEventCode, generateUUID, generatePasswordHash } from "../controllers/utils/generate.js";
import feedback from "../controllers/feedback.js";

const FeedbackSchema = new Mongoose.Schema(
    {
        feedback: {
            type: String,
            required: true
        },
        author: {
            type: String,
            default: "Anonim"
        },
        createdAt: {
            type: Date,
            immutable: true,
            default: () => Date.now()
        }
    },
    {
        _id: false
    }
);

const EventSchema = new Mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        immutable: true,
        unique: true
    },
    accessCode: {
        type: String,
        required: true,
        default: () => generateUUID()
    },
    feedbacks: {
        type: [FeedbackSchema],
        default: []
    }
});

EventSchema.statics.createNewEvent = async function (eventName, password) {
    const event = new this({
        eventName,
        password
    });
    await event.save();
    return event;
};

EventSchema.statics.insertNewFeedback = async function (code, feedback, author) {
    return this.updateOne({ code }, { $push: { feedbacks: { feedback, author } } });
};

EventSchema.statics.getAllFeedback = async function (code, accessCode) {
    try {
        const { feedbacks } = await this.findOne({ code, accessCode }).select("feedbacks -_id");
        return feedbacks;
    } catch (err) {
        console.error(err);
        return null;
    }
};

EventSchema.statics.getAllEventCode = async function () {
    const events = await this.find().select("code -_id");
    return events.map((event) => event.code);
};

EventSchema.statics.validateAccessCode = async function (accessCode) {
    const event = await this.findOne({ accessCode });
    if (!event) {
        return false;
    }
    return true;
};

EventSchema.statics.getInfoByAccessCode = function (accessCode) {
    return this.findOne({ accessCode }).select("-_id -__v").exec();
};

EventSchema.statics.getInfoByEventCode = function (code) {
    return this.findOne({ code }).select("-_id -__v").exec();
};

EventSchema.statics.generateNewAccessCode = async function (code) {
    const newAccessCode = generateUUID();
    const result = await this.updateOne({ code }, { $set: { accessCode: newAccessCode } });
    if (result.modifiedCount > 0) {
        return newAccessCode;
    } else {
        return null;
    }
};

EventSchema.pre("save", async function (next) {
    this.password = await generatePasswordHash(this.password);
    this.code = generateEventCode(await DataModel.getAllEventCode());
    next();
});

const DataModel = Mongoose.model("Event", EventSchema);

export default DataModel;
