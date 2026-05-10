import { StyleSheet } from 'react-native';

export const searchStyles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 12, paddingBottom: 24 },

  // ── Search input ──
  searchInput: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#c1c2c5',
    marginBottom: 8,
  },

  // ── Filter row ──
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterDropdown: {
    flex: 1,
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterLabel: { fontSize: 13, fontWeight: '600', color: '#909296', marginBottom: 4 },
  filterText: { fontSize: 13, color: '#c1c2c5' },
  filterCount: { fontSize: 11, color: '#909296' },

  // ── Results tabs ──
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tabActive: { backgroundColor: '#1976d2' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#909296' },
  tabTextActive: { color: '#fff' },
  tabBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  tabBadgeText: { fontSize: 11, fontWeight: '600', color: '#fff' },

  // ── Game result card ──
  gameCard: {
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
  gameIcon: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#1A1B1E' },
  gameInfo: { flex: 1, gap: 3 },
  gameTitle: { fontSize: 14, fontWeight: '600', color: '#c1c2c5' },
  gameMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  gameStat: { fontSize: 12, color: '#909296' },

  // ── Achievement result card ──
  achievementCard: {
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
  achievementIcon: { width: 42, height: 42, borderRadius: 8, backgroundColor: '#1A1B1E' },
  achievementInfo: { flex: 1, gap: 2 },
  achievementTitle: { fontSize: 14, fontWeight: '600', color: '#c1c2c5' },
  achievementDesc: { fontSize: 12, color: '#909296', lineHeight: 17 },
  achievementGame: { fontSize: 11, color: '#1976d2', marginTop: 1 },
  achievementPoints: { fontSize: 13, fontWeight: '700', color: '#1976d2', minWidth: 40, textAlign: 'right' },

  // ── Pagination ──
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  pageButton: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pageButtonDisabled: { opacity: 0.4 },
  pageButtonText: { fontSize: 14, fontWeight: '600', color: '#c1c2c5' },
  pageInfo: { fontSize: 13, color: '#909296' },

  // ── Empty ──
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: '#909296', fontStyle: 'italic' },

  // ── Dropdown modal ──
  dropdownOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  dropdownList: {
    backgroundColor: '#25262b',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#373A40',
    maxHeight: 300,
    width: '80%',
    paddingVertical: 4,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#373A40',
  },
  dropdownItemText: { fontSize: 14, color: '#c1c2c5' },
  dropdownItemActive: { color: '#1976d2', fontWeight: '600' },
});

export const searchCompact = StyleSheet.create({
  scrollContent: { paddingHorizontal: 8 },
  searchInput: { paddingVertical: 8, fontSize: 14 },
  tabRow: { borderRadius: 8 },
  tab: { paddingVertical: 6 },
  tabText: { fontSize: 12 },
  gameCard: { padding: 8, borderRadius: 8, marginBottom: 6 },
  gameIcon: { width: 42, height: 42, borderRadius: 7 },
  gameTitle: { fontSize: 13 },
  achievementCard: { padding: 8, borderRadius: 8, gap: 8, marginBottom: 6 },
  achievementIcon: { width: 36, height: 36, borderRadius: 7 },
  achievementTitle: { fontSize: 13 },
  achievementDesc: { fontSize: 11, lineHeight: 15 },
  achievementPoints: { fontSize: 12 },
});
