import { StyleSheet } from 'react-native';

export const gameListStyles = StyleSheet.create({
  // ── Game Card ──
  card: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 12,
    marginBottom: 8,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1A1B1E',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c1c2c5',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  consoleTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  consoleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  stat: {
    fontSize: 12,
    color: '#909296',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#373A40',
    marginTop: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },

  // ── Award Badge (inline, next to console) ──
  awardBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  awardBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },

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
  pageButtonDisabled: {
    opacity: 0.4,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c1c2c5',
  },
  pageInfo: {
    fontSize: 13,
    color: '#909296',
  },

  // ── Filters ──
  filterContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
  },
  searchInput: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#c1c2c5',
  },
  filterToggles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1A1B1E',
    borderWidth: 1,
    borderColor: '#373A40',
  },
  filterChipActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#909296',
  },
  filterChipTextActive: {
    color: '#fff',
  },

  // ── Empty state ──
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#909296',
    fontStyle: 'italic',
  },
});

export const gameListCompact = StyleSheet.create({
  card: { padding: 6, marginHorizontal: 6, marginBottom: 4, borderRadius: 7, gap: 6 },
  icon: { width: 34, height: 34, borderRadius: 6 },
  title: { fontSize: 12 },
  metaRow: { gap: 4 },
  consoleTag: { paddingHorizontal: 4 },
  consoleText: { fontSize: 9 },
  stat: { fontSize: 10 },
  awardBadge: { paddingHorizontal: 4, paddingVertical: 1 },
  awardBadgeText: { fontSize: 9 },
  pageButton: { paddingHorizontal: 10, paddingVertical: 6 },
  pageButtonText: { fontSize: 12 },
  pageInfo: { fontSize: 11 },
  filterContainer: { paddingHorizontal: 6, gap: 4 },
  searchInput: { paddingHorizontal: 8, paddingVertical: 7, fontSize: 13 },
  filterChip: { paddingHorizontal: 7, paddingVertical: 4 },
  filterChipText: { fontSize: 11 },
});
