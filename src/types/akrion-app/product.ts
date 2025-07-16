export type Product = {
  id?: string;
  name?: string | null;
  created_at?: string; // ✅ ici !
  description?: string | null;
  intended_use?: string | null;
  intended_user?: string | null;
  intended_environment?: string | null;
  patient_population?: string | null;
  operation_principle?: string | null;
};
