/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "@/lib/api";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import Breadcrumb from "@/components/Breadcrumb";
import SearchFilters from "@/components/SearchFilters"; // Importa el nuevo componente

export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{
    q?: string | string[]
    identificacion?: string | string[]
    clase?: string | string[]
    estado?: string | string[]
    sort?: string | string[]
  }>;
};

export default async function MarcasPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const rawQ = sp?.q;
  const rawIdent = sp?.identificacion;
  const rawClase = sp?.clase;
  const rawSort = sp?.sort;

  const q = Array.isArray(rawQ) ? rawQ[0] : rawQ || undefined;
  const identificacion = Array.isArray(rawIdent) ? rawIdent[0] : rawIdent || undefined;
  const clase = Array.isArray(rawClase) ? rawClase[0] : rawClase || undefined;
  const sort = Array.isArray(rawSort) ? rawSort[0] : rawSort || 'nombre';

  const marcas = await api.listMarcas(q, { identificacion, clase, sort });

  const totalMarcas = marcas.length;

  const getEstadoColor = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'aprobada': return 'bg-green-100 text-green-800 border-green-200';
      case 'tramite': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rechazada': return 'bg-red-100 text-red-800 border-red-200';
      case 'creada': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado?.toLowerCase()) {
      case 'aprobada':
        return <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
      case 'tramite':
        return <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>;
      case 'rechazada':
        return <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
      default:
        return <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Breadcrumb
              className="mb-2"
              prefixItems={[
                { href: "/", label: "Dashboard" },
              ]}
              labelMap={{
                "registro-marca": "Registro de Marca",
              }}
            />
            <h1 className="text-2xl font-bold text-gray-900">Registro de Marca</h1>
            <p className="text-gray-600 mt-1">Gestiona y monitorea todas tus marcas registradas</p>
          </div>
          <Link
            href="/registro-marca/step-1"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Registro
          </Link>
        </div>
      </div>

      <SearchFilters 
        initialQ={q}
        initialIdentificacion={identificacion}
        initialClase={clase}
      />

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {marcas.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {q || clase ? 'No se encontraron marcas' : 'No hay marcas registradas'}
            </h3>
            <p className="text-gray-500 mb-6">
              {q || clase
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza registrando tu primera marca'
              }
            </p>
            <Link
              href="/registro-marca/step-1"
              className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Registrar Primera Marca
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      #
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      Marca
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titular</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button className="flex items-center gap-1 hover:text-gray-700">
                      Estado
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {marcas.map((m: any, idx: number) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{m.nombre}</div>
                        <div className="text-sm text-gray-500">Clase {m.clase_niza}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {m.titular?.tipo_persona === "Natural"
                          ? `${m.titular?.nombres ?? ""} ${m.titular?.apellidos ?? ""}`.trim()
                          : m.titular?.razon_social ?? ""}
                      </div>
                      <div className="text-sm text-gray-500">
                        {m.titular?.tipo_persona}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEstadoColor(m.estado || 'creada')}`}>
                        {getEstadoIcon(m.estado || 'creada')}
                        {m.estado || 'Creada'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {m.creado_en ? new Date(m.creado_en).toLocaleDateString('es-ES') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/registro-marca/${m.id}/edit/step-1`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Editar
                        </Link>
                        <DeleteButton id={m.id} name={m.nombre} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {marcas.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{marcas.length}</span> marcas
              </div>
              <div className="text-sm text-gray-500">
                Total: {totalMarcas} marcas
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}