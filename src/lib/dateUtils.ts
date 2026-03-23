export function diasAteAniversario(dataNascimento: string): number {
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  const proximo = new Date(hoje.getFullYear(), nasc.getMonth(), nasc.getDate());
  if (proximo < hoje) proximo.setFullYear(hoje.getFullYear() + 1);
  return Math.round((proximo.getTime() - hoje.setHours(0, 0, 0, 0)) / 86400000);
}

export function idadeAnos(dataNascimento: string): number {
  const hoje = new Date();
  const nasc = new Date(dataNascimento);
  let anos = hoje.getFullYear() - nasc.getFullYear();
  if (
    hoje.getMonth() < nasc.getMonth() ||
    (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())
  )
    anos--;
  return anos;
}

export function diasParaVencer(data: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.round((new Date(data).getTime() - hoje.getTime()) / 86400000);
}

export function calcularIdade(dataNascimento: string): string {
  const nasc = new Date(dataNascimento);
  const hoje = new Date();
  const anos = hoje.getFullYear() - nasc.getFullYear();
  const meses = hoje.getMonth() - nasc.getMonth();
  const totalMeses = anos * 12 + meses - (hoje.getDate() < nasc.getDate() ? 1 : 0);
  if (totalMeses < 1) return 'menos de 1 mês';
  if (totalMeses < 12) return `${totalMeses} ${totalMeses === 1 ? 'mês' : 'meses'}`;
  const a = Math.floor(totalMeses / 12);
  const m = totalMeses % 12;
  return m === 0
    ? `${a} ${a === 1 ? 'ano' : 'anos'}`
    : `${a} ${a === 1 ? 'ano' : 'anos'} e ${m} ${m === 1 ? 'mês' : 'meses'}`;
}
