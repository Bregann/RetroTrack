import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },

  // ── Welcome Header ──
  welcomeSection: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#c1c2c5',
  },
  welcomeSubtext: {
    fontSize: 13,
    color: '#909296',
    marginTop: 2,
  },

  // ── Loading / Error ──
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: '#909296',
    marginTop: 12,
  },
  errorText: {
    fontSize: 15,
    color: '#fa5252',
    fontWeight: '600',
    marginBottom: 4,
  },

  // ── Section Title ──
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#c1c2c5',
    marginBottom: 10,
    marginTop: 18,
  },

  // ── Quick Links ──
  quickLinksRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickLinkCard: {
    flex: 1,
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  quickLinkIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  quickLinkProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#373A40',
    marginBottom: 6,
  },
  quickLinkLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#c1c2c5',
  },
  quickLinkCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976d2',
    marginTop: 2,
  },

  // ── Last Played Game Card ──
  lastPlayedCard: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  gameIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1A1B1E',
  },
  gameIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1A1B1E',
  },
  gameIconPlaceholder: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameIconText: {
    fontSize: 20,
  },
  lastPlayedInfo: {
    flex: 1,
  },
  lastPlayedName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#c1c2c5',
    marginBottom: 4,
  },
  consoleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  consoleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  lastPlayedEmpty: {
    fontSize: 13,
    color: '#909296',
    fontStyle: 'italic',
  },

  // ── Profile Pill ──
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1B1E',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  profileAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#373A40',
  },
  profileName: {
    fontSize: 12,
    color: '#909296',
    fontWeight: '500',
  },

  // ── Date Divider ──
  dateDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
    gap: 10,
  },
  dateDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#373A40',
  },
  dateDividerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#909296',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Sub-headers (New Sets / Updated Sets) ──
  subHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#909296',
    marginBottom: 8,
    marginTop: 8,
  },

  // ── Update Game Card ──
  updateCard: {
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
  updateIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#1A1B1E',
  },
  updateIcon: {
    width: 42,
    height: 42,
    borderRadius: 6,
    backgroundColor: '#1A1B1E',
  },
  updateIconPlaceholder: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateIconText: {
    fontSize: 16,
  },
  updateInfo: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c1c2c5',
    marginBottom: 3,
  },
  updateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  updateAchievements: {
    fontSize: 12,
    color: '#909296',
  },
  updatePoints: {
    fontSize: 12,
    color: '#909296',
  },
  updateConsoleTag: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  updateConsoleText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },

  // ── Empty state ──
  emptyText: {
    fontSize: 13,
    color: '#909296',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 12,
  },
});

/**
 * Compact overrides for Ayn Thor bottom screen (height < 640px).
 * Apply alongside homeStyles: style={[homeStyles.card, isCompact && homeCompact.card]}
 */
export const homeCompact = StyleSheet.create({
  scrollContent: { paddingHorizontal: 8 },

  welcomeSection: { paddingTop: 10, paddingBottom: 8 },
  welcomeText: { fontSize: 18 },
  welcomeSubtext: { fontSize: 12 },

  loadingContainer: { paddingVertical: 40 },
  loadingText: { fontSize: 13 },

  sectionTitle: { fontSize: 14, marginTop: 12, marginBottom: 8 },

  quickLinksRow: { gap: 8 },
  quickLinkCard: { paddingVertical: 12, paddingHorizontal: 10, borderRadius: 8 },
  quickLinkProfilePic: { width: 36, height: 36, borderRadius: 18 },
  quickLinkLabel: { fontSize: 12 },
  quickLinkCount: { fontSize: 16 },

  lastPlayedCard: { padding: 10, gap: 8, borderRadius: 8 },
  gameIcon: { width: 42, height: 42, borderRadius: 7 },
  lastPlayedName: { fontSize: 14, marginBottom: 3 },
  consoleBadge: { paddingHorizontal: 7 },
  consoleBadgeText: { fontSize: 10 },

  profilePill: { paddingVertical: 3, paddingHorizontal: 8, gap: 4, borderRadius: 12, marginTop: 4 },
  profileAvatar: { width: 18, height: 18, borderRadius: 9 },
  profileName: { fontSize: 11 },

  dateDivider: { marginTop: 12, marginBottom: 6, gap: 8 },
  dateDividerText: { fontSize: 13 },

  subHeader: { fontSize: 12, marginBottom: 6, marginTop: 6 },

  updateCard: { padding: 8, gap: 8, borderRadius: 8, marginBottom: 6 },
  updateIcon: { width: 38, height: 38, borderRadius: 6 },
  updateTitle: { fontSize: 13 },
  updateMeta: { gap: 6 },
  updateAchievements: { fontSize: 11 },
  updatePoints: { fontSize: 11 },
  updateConsoleTag: { paddingHorizontal: 5 },
  updateConsoleText: { fontSize: 9 },
});
