export function exportToCsv(filename: string, rows: string[][]): void {
  if (!rows || !rows.length) return;

  const csvRows = rows.map(row => 
    row.map(cell => {
      let stringCell = cell === null || cell === undefined ? '' : String(cell);
      // Escape double quotes securely for Excel compatibility
      stringCell = stringCell.replace(/"/g, '""');
      // Wrap cells containing commas, quotes, or new lines in double quotes
      if (stringCell.search(/("|,|\n)/g) >= 0) {
        stringCell = `"${stringCell}"`;
      }
      return stringCell;
    }).join(',')
  );

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Safely trigger native browser Download dialogue
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
