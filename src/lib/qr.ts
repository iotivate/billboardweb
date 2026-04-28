import qrcode from "qrcode-generator";

export interface QrMatrix {
  size: number;
  modules: boolean[][]; // [row][col] = true if dark
}

// Generates a QR code matrix for the given value. Type 0 = auto (smallest
// version that fits the data). Error correction 'M' = ~15% — strong enough
// for billboard filming where camera blur and lighting matter.
export function generateQrMatrix(value: string): QrMatrix {
  const qr = qrcode(0, "M");
  qr.addData(value);
  qr.make();
  const size = qr.getModuleCount();
  const modules: boolean[][] = [];
  for (let r = 0; r < size; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < size; c++) {
      row.push(qr.isDark(r, c));
    }
    modules.push(row);
  }
  return { size, modules };
}
