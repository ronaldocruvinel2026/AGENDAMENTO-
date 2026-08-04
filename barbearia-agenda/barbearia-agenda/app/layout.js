export const metadata = {
  title: 'Agendamento',
  description: 'Agende seu horário',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
