export type TipoPersona = "Natural" | "Juridica";
export type Sector = "Comercio" | "Manufactura" | "Servicios";

export interface ContactoIn {
    nombres: string; apellidos: string; email: string;
    telefono: string; direccion: string; pais: string; ciudad: string;
}
export interface InfoEmpresarialIn { sector: Sector; ingresos_anuales: number; }
export interface TitularIn {
    tipo_persona: TipoPersona;
    nombres?: string | null; apellidos?: string | null; identificacion?: string | null;
    razon_social?: string | null; nit?: string | null;
    rep_legal_nombres?: string | null; rep_legal_apellidos?: string | null; rep_legal_identificacion?: string | null;
}
export interface MarcaCreate {
    nombre: string; clase_niza: number;
    titular_id?: number;
    titular?: TitularIn; info_empresarial?: InfoEmpresarialIn; contacto?: ContactoIn;
}
export interface MarcaOut {
    id: number; nombre: string; clase_niza: number;
    creado_en?: string | null; actualizado_en?: string | null;
    titular: {
        id: number; tipo_persona: TipoPersona;
        nombres?: string | null; apellidos?: string | null; identificacion?: string | null;
        razon_social?: string | null; nit?: string | null;
        rep_legal_nombres?: string | null; rep_legal_apellidos?: string | null; rep_legal_identificacion?: string | null;
    };
    contacto?: (ContactoIn & { id: number }) | null;
    info_empresarial?: (InfoEmpresarialIn & { id: number }) | null;
}
