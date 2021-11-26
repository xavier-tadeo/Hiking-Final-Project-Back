import { Schema, model, ObjectId } from "mongoose";

interface Stadistics {
  distance: string;
  time: string;
  elevation: string;
  dificulty: number;
}

interface Maping {
  latitude: number;
  longitude: number;
}
interface Hiking {
  title: string;
  description: string;
  map: Maping;
  images: string;
  user: ObjectId;
  stadistics: Stadistics;
}

const hikingSchema: Schema<Hiking> = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  map: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  images: { type: String, required: true },
  user: { type: Schema.Types.ObjectId },
  stadistics: {
    distance: { type: String, require: true },
    time: { type: String, require: true },
    elevation: { type: String, require: true },
    dificulty: { type: Number, require: true },
  },
});

const HikingModel = model<Hiking>("hiking", hikingSchema, "hikings");

export default HikingModel;
