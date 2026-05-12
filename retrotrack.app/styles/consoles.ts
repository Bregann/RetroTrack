import { StyleSheet } from 'react-native';

export const consoleStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 16 },

  section: { marginBottom: 18 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    paddingVertical: 6,
  },
  sectionIcon: { fontSize: 20 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#c1c2c5' },

  card: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#c1c2c5' },
  cardCount: { fontSize: 12, color: '#909296' },

  progressRow: { gap: 4 },
  progressItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressLabel: { fontSize: 12, fontWeight: '600', color: '#909296', width: 72 },
  progressBar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: '#373A40', overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 3 },
  progressValue: { fontSize: 11, color: '#909296', minWidth: 36, textAlign: 'right' },

  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: '#909296', fontStyle: 'italic' },
});

export const consoleCompact = StyleSheet.create({
  scrollContent: { paddingHorizontal: 8 },
  section: { marginBottom: 12 },
  sectionHeader: { marginBottom: 6 },
  sectionTitle: { fontSize: 14 },
  card: { padding: 8, borderRadius: 8, marginBottom: 6 },
  cardTitle: { fontSize: 14 },
  cardCount: { fontSize: 11 },
  progressLabel: { fontSize: 11, width: 64 },
  progressBar: { height: 5 },
  progressFill: { height: 5 },
  progressValue: { fontSize: 10, minWidth: 30 },
});
