import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 32 },

  // ── Header ──
  headerCard: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#373A40', marginBottom: 8 },
  username: { fontSize: 20, fontWeight: '700', color: '#c1c2c5', marginBottom: 4 },
  pointsRow: { flexDirection: 'row', gap: 16, marginBottom: 6 },
  pointsItem: { alignItems: 'center' },
  pointsLabel: { fontSize: 10, fontWeight: '600', color: '#909296', textTransform: 'uppercase', letterSpacing: 0.5 },
  pointsValue: { fontSize: 15, fontWeight: '700', color: '#fab005' },
  lastUpdated: { fontSize: 11, color: '#909296' },

  // ── Stats ──
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statValue: { fontSize: 22, fontWeight: '700', color: '#c1c2c5' },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#909296', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },

  // ── Section ──
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#c1c2c5', marginBottom: 8 },
  sectionCount: { fontSize: 12, color: '#909296', fontWeight: '400' },

  // ── Game wall grid ──
  wallGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  wallIcon: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#1A1B1E',
    borderWidth: 2,
    borderColor: '#373A40',
  },
  wallIconHardcore: { borderColor: '#fab005' },
  wallIconSoftcore: { borderColor: '#15aabf' },

  // ── Recent games list ──
  recentCard: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  recentIcon: { width: 42, height: 42, borderRadius: 8, backgroundColor: '#1A1B1E' },
  recentInfo: { flex: 1, gap: 2 },
  recentTitle: { fontSize: 14, fontWeight: '600', color: '#c1c2c5' },
  recentMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recentStat: { fontSize: 12, color: '#909296' },
  recentDate: { fontSize: 11, color: '#909296' },

  // ── Empty ──
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: '#909296', fontStyle: 'italic' },
});

export const profileCompact = StyleSheet.create({
  scrollContent: { paddingHorizontal: 8 },
  headerCard: { padding: 12, borderRadius: 10, marginBottom: 8 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  username: { fontSize: 18 },
  pointsValue: { fontSize: 14 },
  statsGrid: { gap: 6, marginBottom: 12 },
  statCard: { paddingVertical: 8, paddingHorizontal: 6 },
  statValue: { fontSize: 18 },
  section: { marginBottom: 12 },
  sectionTitle: { fontSize: 14 },
  wallGrid: { gap: 4 },
  wallIcon: { width: 48, height: 48, borderRadius: 7 },
  recentCard: { padding: 8, borderRadius: 8, gap: 8, marginBottom: 6 },
  recentIcon: { width: 36, height: 36, borderRadius: 7 },
  recentTitle: { fontSize: 13 },
});
