import { StyleSheet } from 'react-native';

export const playlistStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 16 },

  // ── Tab bar ──
  tabRow: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#1A1B1E',
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: { backgroundColor: '#1976d2' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#909296' },
  tabTextActive: { color: '#fff' },

  // ── Search ──
  searchInput: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#c1c2c5',
    marginBottom: 10,
  },

  // ── Playlist card ──
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
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#c1c2c5', flex: 1 },
  cardBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#1A1B1E',
    borderWidth: 1,
    borderColor: '#373A40',
  },
  cardBadgeText: { fontSize: 10, fontWeight: '600', color: '#909296' },
  cardDesc: { fontSize: 13, color: '#909296', marginBottom: 8, lineHeight: 18 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 12, color: '#909296' },

  // ── Game icon strip ──
  iconStrip: { flexDirection: 'row', gap: 4, marginBottom: 10 },
  iconSlot: { width: 40, height: 40, borderRadius: 6, backgroundColor: '#1A1B1E' },

  // ── Creator pill ──
  creator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  creatorText: { fontSize: 12, color: '#909296' },

  // ── Empty ──
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: '#909296', fontStyle: 'italic' },
});

export const playlistCompact = StyleSheet.create({
  scrollContent: { paddingHorizontal: 8 },
  tabRow: { borderRadius: 8 },
  tab: { paddingVertical: 6 },
  tabText: { fontSize: 12 },
  searchInput: { paddingVertical: 7, fontSize: 13 },
  card: { padding: 8, borderRadius: 8, marginBottom: 6 },
  cardTitle: { fontSize: 14 },
  cardDesc: { fontSize: 12, marginBottom: 6, lineHeight: 16 },
  cardMetaText: { fontSize: 11 },
  iconSlot: { width: 34, height: 34, borderRadius: 5 },
  creatorText: { fontSize: 11 },
  emptyText: { fontSize: 13 },
});
