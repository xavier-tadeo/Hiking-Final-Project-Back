const { Schema, model } = require("mongoose");

interface Hiking {
  title: string;
  img: string;
  description: string;
  userId: string;
  map: string;
  stadistics: object;
  distance: string;
  time: string;
  elevation: string;
  dificulty: number;
}

const hikingSchema: Hiking = new Schema({
  title: { type: String, required: true },
  img: { type: String, required: true },
  description: { type: String, required: true },
  userId: { type: String },
  map: { type: String, required: true },
  stadistics: {
    distance: { type: String, require: true },
    time: { type: String, require: true },
    elevation: { type: String, require: true },
    dificulty: { type: Number, require: true },
  },
});

const HikingModel: Hiking = model("hiking", hikingSchema, "hikings");

export = { HikingModel };
