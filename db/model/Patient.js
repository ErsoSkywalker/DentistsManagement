const { Schema, model } = require("mongoose");

const PatientSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    contacto: [
      {
        typeContact: {
          type: String,
          required: true,
          trim: true,
        },
        contact: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    Dentist: {
      type: Schema.Types.ObjectId,
      ref: "Dentist",
      required: true,
    },
    estado: {
      type: String,
      required: true,
      trim: true,
      default: "Activo",
    },
    deuda: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("Patient", PatientSchema);
