import { DriverLog } from "../types";

export const getMonthNameSpanish = (m: number) => {
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return monthNames[m];
};

export const downloadTxtFile = (filename: string, text: string) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const handleDownloadDailyTxt = (log: DriverLog, currencySymbol: string) => {
  const d = new Date(log.date + "T00:00:00");
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = d.toLocaleDateString('es-ES', options);

  let text = `========================================\n`;
  text += `        REPORTE DIARIO DE CONDUCCIÓN\n`;
  text += `========================================\n\n`;
  text += `Fecha: ${formattedDate}\n`;
  text += `Día registrado: ${log.dayLabel}\n`;
  text += `Kilómetros recorridos: ${log.kilometers || 0} km\n`;
  text += `----------------------------------------\n`;
  text += `INGRESOS POR PLATAFORMA:\n`;
  if (log.incomes && log.incomes.length > 0) {
    log.incomes.forEach((inc) => {
      text += `  - ${inc.source}: ${currencySymbol}${inc.amount.toFixed(2)}\n`;
    });
  } else {
    text += `  - ${currencySymbol}0.00 (Sin ingresos registrados)\n`;
  }
  text += `Total Ingresos Brutos: ${currencySymbol}${log.grossIncome.toFixed(2)}\n`;
  text += `----------------------------------------\n`;
  text += `GASTOS OPERATIVOS:\n`;
  text += `  - Combustible / Carga: ${currencySymbol}${log.fuelExpense.toFixed(2)}\n`;
  text += `  - Mantenimiento (Día): ${currencySymbol}${log.maintenanceExpense.toFixed(2)}\n`;
  text += `  - Otros: ${currencySymbol}${log.otherExpense.toFixed(2)}\n`;
  const totalExpenses = log.fuelExpense + log.maintenanceExpense + log.otherExpense;
  text += `Total Gastos: ${currencySymbol}${totalExpenses.toFixed(2)}\n`;
  text += `----------------------------------------\n`;
  text += `MARGEN NETO DIARIO: ${currencySymbol}${log.netIncome.toFixed(2)}\n`;
  text += `========================================\n`;

  downloadTxtFile(`Reporte_Diario_${log.date}.txt`, text);
};

export const handleDownloadMonthlyTxt = (month: number, year: number, logs: DriverLog[], currencySymbol: string) => {
  const filteredLogs = logs.filter(l => {
    if (!l.date) return false;
    const d = new Date(l.date + "T00:00:00");
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const monthName = getMonthNameSpanish(month);
  const totalGross = filteredLogs.reduce((sum, l) => sum + l.grossIncome, 0);
  const totalFuel = filteredLogs.reduce((sum, l) => sum + l.fuelExpense, 0);
  const totalMaint = filteredLogs.reduce((sum, l) => sum + l.maintenanceExpense, 0);
  const totalOther = filteredLogs.reduce((sum, l) => sum + (l.otherExpense || 0), 0);
  const totalKms = filteredLogs.reduce((sum, l) => sum + (l.kilometers || 0), 0);
  const totalNet = filteredLogs.reduce((sum, l) => sum + l.netIncome, 0);

  const platformsBreakdown: { [key: string]: number } = {};
  filteredLogs.forEach(log => {
    if (log.incomes) {
      log.incomes.forEach(inc => {
        platformsBreakdown[inc.source] = (platformsBreakdown[inc.source] || 0) + inc.amount;
      });
    }
  });

  let text = `========================================\n`;
  text += `      RESUMEN MENSUAL - ${monthName.toUpperCase()} ${year}\n`;
  text += `========================================\n\n`;
  text += `Días conducidos: ${filteredLogs.length}\n`;
  text += `Total Kilómetros recorridos: ${totalKms} km\n`;
  text += `----------------------------------------\n`;
  text += `RESUMEN FINANCIERO:\n`;
  text += `Total Ingresos Brutos (Facturación): ${currencySymbol}${totalGross.toFixed(2)}\n`;
  text += `Total Combustible: ${currencySymbol}${totalFuel.toFixed(2)}\n`;
  text += `Total Mantenimiento: ${currencySymbol}${totalMaint.toFixed(2)}\n`;
  text += `Total Otros Gastos: ${currencySymbol}${totalOther.toFixed(2)}\n`;
  const totalExpenses = totalFuel + totalMaint + totalOther;
  text += `Total Gastos Operativos: ${currencySymbol}${totalExpenses.toFixed(2)}\n`;
  text += `----------------------------------------\n`;
  text += `MARGEN NETO MENSUAL: ${currencySymbol}${totalNet.toFixed(2)}\n`;
  text += `----------------------------------------\n`;
  text += `DESGLOSE DE INGRESOS POR PLATAFORMA:\n`;

  Object.keys(platformsBreakdown).forEach(source => {
    text += `  - ${source}: ${currencySymbol}${platformsBreakdown[source].toFixed(2)}\n`;
  });

  text += `----------------------------------------\n`;
  text += `PROMEDIOS DIARIOS:\n`;
  if (filteredLogs.length > 0) {
    text += `  - Ingreso Bruto promedio: ${currencySymbol}${(totalGross / filteredLogs.length).toFixed(2)}\n`;
    text += `  - Kilómetros promedio: ${(totalKms / filteredLogs.length).toFixed(1)} km\n`;
    text += `  - Neto Limpio promedio: ${currencySymbol}${(totalNet / filteredLogs.length).toFixed(2)}\n`;
  } else {
    text += `  - No hay datos para promediar.\n`;
  }
  text += `========================================\n`;

  downloadTxtFile(`Resumen_Mensual_${monthName}_${year}.txt`, text);
};
