import { StyleSheet } from 'react-native';

export const gamePageStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 80,
  },

  // ── Loading ──
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#909296',
    marginTop: 12,
  },

  // ── Hero ──
  heroBoxArt: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    backgroundColor: '#25262b',
    marginBottom: 12,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#25262b',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#c1c2c5',
    flex: 1,
  },
  heroConsoleTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 12,
  },
  heroConsoleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  // ── Screenshots ──
  screenshotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  screenshot: {
    flex: 1,
    height: 160,
    borderRadius: 10,
    backgroundColor: '#25262b',
  },

  // ── Section title ──
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#c1c2c5',
    marginBottom: 8,
    marginTop: 4,
  },

  // ── Stats grid ──
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#909296',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#c1c2c5',
  },
  statSubtext: {
    fontSize: 11,
    color: '#909296',
    marginTop: 1,
  },

  // ── Info rows ──
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#373A40',
  },
  infoLabel: {
    fontSize: 13,
    color: '#909296',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#c1c2c5',
  },

  // ── Achievement Card ──
  achievementCard: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#1A1B1E',
  },
  achievementIconLocked: {
    opacity: 0.4,
  },
  achievementInfo: {
    flex: 1,
    gap: 2,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c1c2c5',
  },
  achievementDesc: {
    fontSize: 13,
    color: '#909296',
    lineHeight: 18,
  },
  achievementMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 3,
  },
  achievementDate: {
    fontSize: 12,
    color: '#909296',
  },
  achievementPoints: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1976d2',
    minWidth: 48,
    textAlign: 'right',
  },

  // ── Achievement filters ──
  filterBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
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

  // ── Subsets ──
  subsetCard: {
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
  subsetIcon: {
    width: 42,
    height: 42,
    borderRadius: 6,
    backgroundColor: '#1A1B1E',
  },
  subsetInfo: {
    flex: 1,
  },
  subsetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c1c2c5',
  },
  subsetProgress: {
    fontSize: 12,
    color: '#909296',
    marginTop: 2,
  },

  // ── Floating update button ──
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    backgroundColor: '#1976d2',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  floatingButtonDisabled: {
    opacity: 0.5,
  },
  floatingButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});

export const gamePageCompact = StyleSheet.create({
  heroBoxArt: { height: 140 },
  heroIcon: { width: 34, height: 34, borderRadius: 7 },
  heroTitle: { fontSize: 16 },
  heroConsoleTag: { paddingHorizontal: 6 },
  heroConsoleText: { fontSize: 10 },
  screenshot: { height: 90 },
  sectionTitle: { fontSize: 12, marginBottom: 4 },
  statsGrid: { gap: 4, marginBottom: 8 },
  statCard: { paddingVertical: 6, paddingHorizontal: 6 },
  statValue: { fontSize: 14 },
  infoRow: { paddingVertical: 5 },
  infoLabel: { fontSize: 11 },
  infoValue: { fontSize: 11 },
  achievementCard: { padding: 8, gap: 8, borderRadius: 8, marginBottom: 4 },
  achievementIcon: { width: 42, height: 42, borderRadius: 8 },
  achievementTitle: { fontSize: 14 },
  achievementDesc: { fontSize: 12, lineHeight: 16 },
  achievementDate: { fontSize: 11 },
  achievementPoints: { fontSize: 14 },
  floatingButton: { bottom: 10, right: 10, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 22 },
  floatingButtonText: { fontSize: 12 },
});
