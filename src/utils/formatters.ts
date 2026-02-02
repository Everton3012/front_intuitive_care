export function formatCnpj(cnpj: string): string {
    if (!cnpj) return "-";
    const digits = cnpj.replace(/\D/g, "").padStart(14, "0");
    return digits.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  }
  
  export function formatMoney(value: number): string {
    if (value == null) return "-";
    return new Intl.NumberFormat("pt-BR", { 
      style: "currency", 
      currency: "BRL" 
    }).format(value);
  }
  
  export function formatDate(date: string | Date): string {
    if (!date) return "-";
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  }