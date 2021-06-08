const Dentist = require("./model/Dentist");
const Patient = require("./model/Patient");
const Cita = require("./model/Citas");
const jwt = require("jsonwebtoken");
const crearToken = (Dentist, secreta, expiresIn) => {
  const { id, usuario, nombre, apellido } = Dentist;
  return jwt.sign({ id, usuario, nombre, apellido }, secreta, {
    expiresIn,
  });
};

const resolvers = {
  Query: {
    getApiVersion: () => "1.0.0",
    getPatients: async (_, {}, ctx) => {
      return await Patient.find({ Dentist: ctx.user.id, estado: "Activo" });
    },
    getCitas: async (_, {}, ctx) => {
      const salida = await Cita.find({ Dentist: ctx.user.id }).populate(
        "Patient"
      );
      console.log(salida);

      return salida;
    },
    getUser: async (_, {}, ctx) => {
      const dentist = await Dentist.findOne({ _id: ctx.user.id });
      return dentist;
    },
  },
  Mutation: {
    createNewDentist: async (_, { input }, ctx) => {
      const { usuario, password } = input;
      const existeDentist = await Dentist.findOne({ usuario });
      if (existeDentist) {
        throw new Error("Ese usuario ya existe!");
      }

      const newDentist = new Dentist(input);
      newDentist.password = await newDentist.encryptPassword(password);

      newDentist.save();
      return newDentist;
    },
    autenticateDentist: async (_, { input }, ctx) => {
      const { usuario, password } = input;

      const existeDentista = await Dentist.findOne({ usuario });
      if (!existeDentista) {
        throw new Error("No existe el dentista que señalas");
      }
      const passwordCorrecto = await existeDentista.matchPassword(
        password,
        existeDentista.password
      );
      if (!passwordCorrecto) {
        throw new Error("La combinación que escoges no es correcta");
      }

      return {
        token: crearToken(existeDentista, process.env.SECRET, "24h"),
      };
    },
    createNewPatient: async (_, { input }, ctx) => {
      const patientGo = {
        nombre: input.nombre,
        apellido: input.apellido,
        contacto: input.contacto,
        Dentist: ctx.user.id,
      };

      const newPatient = await Patient(patientGo);
      newPatient.save();
      return newPatient;
    },
    createNewCita: async (_, { input }, ctx) => {
      const newCitaGo = {
        Dentist: ctx.user.id,
        Patient: input.Patient,
        DateArranged: input.DateArranged,
        cost: input.cost,
        conceptos: input.conceptos,
      };

      const existePatient = await Patient.findById(input.Patient);
      if (!existePatient) {
        throw new Error("Este paciente no existe");
      }

      existePatient.deuda += input.cost;

      await Patient.findOneAndUpdate(
        {
          _id: input.Patient,
        },
        existePatient,
        { new: true }
      );

      const newCita = await Cita(newCitaGo);
      newCita.save();
      return newCita;
    },
    payAccountPatient: async (_, { input }, ctx) => {},
    changeStatusPatient: async (_, { idPatient }, ctx) => {
      await Patient.findOneAndUpdate(
        {
          _id: idPatient,
        },
        { estado: "Inactivo" },
        { new: true }
      );
      return "Estado cambiado con éxito";
    },
  },
};

module.exports = resolvers;
