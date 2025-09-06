import Mongoose from "mongoose";
import { generateEventCode, generateUUID, generatePasswordHash } from "../controllers/utils/generate.js";

Mongoose.connect("mongodb://localhost:27017/annonfeed");

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

EventSchema.statics.insertNewFeedback = async function (code, feedbackObj) {
    return this.findOneAndUpdate({ code }, { $push: { feedbacks: feedbackObj } });
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

EventSchema.pre("save", async function (next) {
    this.password = await generatePasswordHash(this.password);
    this.code = generateEventCode(await DataModel.getAllEventCode());
    next();
});

// setTimeout(async () => {
//     const a = DataModel.create({
//         eventName: "Event Name",
//         password: "passwordHash"
//     });
//     // const a = DataModel.insertNewFeedback(522349, { feedback: "Test feedback", author: "Ade Akbar" });

//     // const a = DataModel.getAllFeedback(522449, "3ebbb259-22ab-48b3-8ea7-02dafe36abd9");

//     // const a = await DataModel.getAllEventCode();
//     console.log(await a);
// }, 300);

const DataModel = Mongoose.model("Event", EventSchema);

export default DataModel;
