const { gql } = require("apollo-server");

const typeDefs = gql`
  enum entityEstado {
    Activo
    Inactivo
  }

  input AuthInput {
    usuario: String!
    password: String!
  }

  type Token {
    token: String
  }

  input DentistInput {
    nombre: String!
    apellido: String!
    usuario: String!
    password: String!
  }

  type DentistType {
    id: ID
    nombre: String
    apellido: String
    usuario: String
    estado: entityEstado
  }

  input contactoInput {
    typeContact: String!
    contact: String!
  }

  input PatientInput {
    nombre: String!
    apellido: String!
    contacto: [contactoInput]!
  }

  type contactoType {
    id: ID
    typeContact: String
    contact: String
  }

  type PatientType {
    id: ID
    nombre: String
    apellido: String
    contacto: [contactoType]
    estado: String
    deuda: Float
  }

  type Query {
    getApiVersion: String
    getPatients: [PatientType]
    getCitas: [CitaType]
    getUser: DentistType
  }

  type conceptosType {
    id: ID!
    tipoTratamiento: tipoTratamientoEnum
    piezas: [String]
  }

  type CitaType {
    id: ID
    Patient: PatientType
    DateArranged: String
    cost: Float
    conceptos: [conceptosType]
  }

  enum tipoTratamientoEnum {
    LIMPIEZA
    REVISION
  }

  input conceptosInput {
    tipoTratamiento: String!
    piezas: [String]!
  }

  input CitaInput {
    Patient: ID!
    DateArranged: String!
    cost: Float!
    conceptos: [conceptosInput]!
  }

  type Mutation {
    createNewDentist(input: DentistInput!): DentistType
    autenticateDentist(input: AuthInput!): Token
    createNewPatient(input: PatientInput!): PatientType
    createNewCita(input: CitaInput!): CitaType
    payAccountPatient(input: Float): PatientType
    changeStatusPatient(idPatient: ID!): String
  }
`;

module.exports = typeDefs;
