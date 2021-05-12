const { Schema, model } = require("mongoose");

const CitaSchema = new Schema(
  {
    Dentist: {
      type: Schema.Types.ObjectId,
      ref: "Dentist",
      required: true,
    },
    Patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    DateArranged: {
      type: Date,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    conceptos: [
      {
        tipoTratamiento: {
          type: String,
          required: true,
          trim: true,
        },
        piezas: [
          {
            type: String,
            required: true,
            trim: true,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Cita", CitaSchema);
