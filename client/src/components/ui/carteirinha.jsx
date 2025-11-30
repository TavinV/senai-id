import senai from "../../assets/senai.png";
import redStamp from "../../assets/redStamp.svg";
import blueStamp from "../../assets/blueStamp.svg";
import { useAuthContext } from "../../context/authContext";
import { useState } from "react";
import api from "../../services/api";

const Carteirinha = ({
  showQR = false,
  name = "Nome do Estudante",
  dateOfBirth = "00/00/0000",
  course = "",
  matricula = "00000000",
  cpf = "000.000.000-00",
  type = "aluno", // 'aluno' ou 'funcionario'
  role = "", // cargo do funcionário
  pis = "", // PIS do funcionário
  nif = "", // NIF do funcionário
}) => {
  const borderColor =
    type === "funcionario" ? "border-blue-600" : "border-red-600";
  const { user } = useAuthContext();
  const [qrOpen, setQrOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);

  const openQrModal = async () => {
    setQrError(null);
    setQrLoading(true);
    try {
      const response = await api.get("/users/me/access");
      const url = response.data?.data?.url;
      if (!url) throw new Error("QR url não encontrada");
      setQrUrl(url.replace(/&amp;/g, "&"));
      setQrOpen(true);
    } catch (err) {
      console.error("Erro ao obter QR:", err);
      setQrError("Não foi possível carregar o QR code.");
    } finally {
      setQrLoading(false);
    }
  };

  const closeQrModal = () => {
    setQrOpen(false);
    setQrUrl(null);
    setQrError(null);
  };

  return (
    <>
    <div
      className={`flex flex-col items-center w-full max-w-xs sm:max-w-md md:max-w-2xl gap-4 sm:gap-4 md:gap-6 bg-white rounded-lg shadow-md py-6 sm:py-6 md:py-8 px-4 sm:px-6 md:px-10 lg:px-14`}
      style={{ minWidth: 0 }}
    >
      {/* Logo SENAI */}
      <img className="w-20 sm:w-24 md:w-32" src={senai} alt="Logo SENAI" />
      {/* Nome da escola */}
      <h2 className="font-bold text-base sm:text-lg md:text-xl text-center">
        Escola Senai Nami Jafet
      </h2>
      {/* Foto do estudante/funcionário */}
      <div className="relative">
        <img
          src={user?.foto_perfil}
          alt="Foto de perfil"
          className={`w-24 h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full object-cover border-2 ${borderColor} bg-gray-800`}
        />
      </div>
      <div>
        {/* Cargo (apenas para funcionários) */}
        {type === "funcionario" && (
          <div className="text-base sm:text-base md:text-lg font-bold text-blue-700 text-center mb-1">
            {role}
          </div>
        )}
        {/* Nome */}
        <h1 className="text-center text-xl sm:text-xl md:text-2xl font-bold w-full pb-2">
          {name}
        </h1>
      </div>
      {/* Seção de informações específicas */}
      <div className="w-full flex flex-col gap-4 sm:gap-4 md:gap-6 mt-1 sm:mt-2">
        <div className="w-full grid grid-cols-2 gap-4 sm:gap-6 md:gap-10 text-center text-sm sm:text-base">
          {/* Coluna 1 */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-10 items-start justify-center">
            <div className="flex flex-col items-start">
              <span className="text-sm sm:text-sm md:text-base">CPF</span>
              <span className="text-base sm:text-base md:text-lg font-bold">
                {cpf}
              </span>
            </div>
            {type === "aluno" ? (
              <div className="flex flex-col items-start">
                <span className="text-sm sm:text-sm md:text-base">
                  Matrícula
                </span>
                <span className="text-base sm:text-base md:text-lg font-bold">
                  {matricula}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-start">
                <span className="text-sm sm:text-sm md:text-base">PIS</span>
                <span className="text-base sm:text-base md:text-lg font-bold">
                  {pis}
                </span>
              </div>
            )}
          </div>
          {/* Coluna 2 */}
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-10 items-end justify-center">
            {type === "aluno" ? (
              <div className="flex flex-col items-center">
                <span className="text-sm sm:text-sm md:text-base">
                  Nascido em
                </span>
                <span className="text-base sm:text-base md:text-lg font-bold">
                  {dateOfBirth}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-sm sm:text-sm md:text-base">NIF</span>
                <span className="text-base sm:text-base md:text-lg font-bold">
                  {nif}
                </span>
              </div>
            )}
            <img
              className="w-14 h-14 sm:w-14 sm:h-14 md:w-16 md:h-16"
              src={type === "funcionario" ? blueStamp : redStamp}
              alt="Carimbo de validação"
            />
          </div>
        </div>
        {/* Curso/Departamento centralizado no fim */}
        <div className="w-full text-center mt-2 sm:mt-3 md:mt-5 flex flex-col items-center">
          <span className="text-base sm:text-base md:text-lg font-bold text-gray-800">
            {course}
          </span>
        </div>
        {
          showQR && (
            <div className="w-full mt-4 flex justify-center">
              <button
                type="button"
                onClick={openQrModal}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition text-sm sm:text-base"
                aria-haspopup="dialog"
              >
                {qrLoading ? "Carregando..." : "Abrir QR Code"}
              </button>
            </div>
          )
        }
        {/* Botão para abrir o modal do QR Code */}
      </div>
    </div>

    {/* Modal do QR Code */}
    {qrOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm sm:max-w-md p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl sm:text-2xl font-semibold">QR Code de acesso</h3>
            <button
              onClick={closeQrModal}
              className="text-gray-600 hover:text-gray-800 text-2xl"
              aria-label="Fechar modal"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col items-center gap-6">
            {qrError && <p className="text-base sm:text-lg text-red-600">{qrError}</p>}
            {!qrError && qrUrl && (
              <img src={qrUrl} alt="QR Code de acesso" className="w-64 h-64 sm:w-80 sm:h-80 object-contain" />
            )}
            {!qrError && !qrUrl && (
              <p className="text-base sm:text-lg text-gray-600">Nenhum QR disponível</p>
            )}

            <div className="w-full flex justify-end">
              <button onClick={closeQrModal} className="px-6 py-3 text-base sm:text-lg rounded-md bg-gray-100 hover:bg-gray-200 transition">Fechar</button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default Carteirinha;
