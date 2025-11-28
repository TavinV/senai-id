import senai from "../../assets/senai.png";
import redStamp from "../../assets/redStamp.svg";
import blueStamp from "../../assets/blueStamp.svg";
import { useAuthContext } from "../../context/authContext";

const Carteirinha = ({
  name = "Nome do Estudante",
  dateOfBirth = "00/00/0000",
  course = "",
  matricula = "00000000",
  cpf = "000.000.000-00",
  type = "aluno", // 'aluno' ou 'funcionario'
  role = "", // cargo do funcionário
  pis = "", // PIS do funcionário
  nif = "" // NIF do funcionário
}) => {
  const borderColor = type === "funcionario" ? "border-blue-600" : "border-red-600";
  const { user } = useAuthContext();

  return (
    <div
      className={`flex flex-col items-center w-[350px] max-w-md sm:max-w-lg md:max-w-xl lg:w-[450px] xl:max-w-3xl gap-6 bg-white rounded-lg shadow-md py-6 px-4 sm:px-8 md:px-12 lg:px-16 `}
      style={{ minWidth: 0 }}
    >
      {/* Logo SENAI */}
      <img className="w-24 sm:w-32" src={senai} alt="Logo SENAI" />
      {/* Nome da escola */}
      <h2 className="font-bold text-lg sm:text-xl text-center">
        Escola Senai Nami Jafet
      </h2>
      {/* Foto do estudante/funcionário */}
      <div className="relative">
        <img
          src={user?.foto_perfil}
          alt="Foto de perfil"
          className={`w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover border-2 ${borderColor} bg-gray-800`}
        />
      </div>
      <div>
        {/* Cargo (apenas para funcionários) */}
        {type === "funcionario" && (
          <div className="text-lg font-bold text-blue-700 text-center mb-1">
            {role}
          </div>
        )}
        {/* Nome */}
        <h1
          className={`text-center text-xl sm:text-2xl font-bold w-full pb-2 ${
            type === "funcionario" ? "text-blue-700" : "text-red-700"
          }`}
        >
          {name}
        </h1>
      </div>
      {/* Seção de informações específicas */}
      <div className="w-full flex flex-col gap-4 mt-2">
        <div className="w-full grid grid-cols-2 gap-10 text-center">
          {/* Coluna 1 */}
          <div className="flex flex-col gap-10 items-start justify-center">
            <div className="flex flex-col items-start">
              <span className="text-base">CPF</span>
              <span className="text-lg font-bold">{cpf}</span>
            </div>
            {type === "aluno" ? (
              <div className="flex flex-col items-start">
                <span className="text-base">Matrícula</span>
                <span className="text-lg font-bold">{matricula}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-base">PIS</span>
                <span className="text-lg font-bold">{pis}</span>
              </div>
            )}
          </div>
          {/* Coluna 2 */}
          <div className="flex flex-col gap-10 items-end justify-center">
            {type === "aluno" ? (
              <div className="flex flex-col items-center">
                <span className="text-base">Nascido em</span>
                <span className="text-lg font-bold">{dateOfBirth}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-base">NIF</span>
                <span className="text-lg font-bold">{nif}</span>
              </div>
            )}
            <img
              className="w-15 h-15 sm:w-15 sm:h-15  items-end"
              src={type === "funcionario" ? blueStamp : redStamp}
              alt="Carimbo de validação"
            />
          </div>
        </div>
        {/* Curso/Departamento centralizado no fim */}
        <div className="w-full text-center mt-3 sm:mt-5 flex flex-col items-center">
          <span className="text-base">
            {type === "aluno" ? "Curso" : "Departamento"}
          </span>
          <span className="text-lg font-bold text-gray-800">{course}</span>
        </div>
      </div>
    </div>
  );
};

export default Carteirinha;
