export const paymentMethods = {
  telebirr: '0926773391',
  bankName: 'Commercial Bank of Ethiopia (CBE)',
  bankAccountNumber: '1000609903407',
  bankAccountName: 'Ruhama Markos',
} as const

export const bankTransferLabel = `${paymentMethods.bankName} — Account ${paymentMethods.bankAccountNumber} (${paymentMethods.bankAccountName})`
