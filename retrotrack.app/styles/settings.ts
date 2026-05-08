import { StyleSheet } from 'react-native';

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#c1c2c5',
    marginBottom: 20,
  },

  // ── Section ──
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#909296',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },

  // ── Row ──
  row: {
    backgroundColor: '#25262b',
    borderWidth: 1,
    borderColor: '#373A40',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowFirst: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  rowLast: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  rowSingle: {
    borderRadius: 10,
  },
  rowLabel: {
    fontSize: 15,
    color: '#c1c2c5',
    flex: 1,
  },

  // ── Segmented Control ──
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#1A1B1E',
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  segmentActive: {
    backgroundColor: '#1976d2',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#909296',
  },
  segmentTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // ── Row ──
  rowValue: {
    fontSize: 13,
    color: '#909296',
    marginRight: 8,
  },
  rowDanger: {
    backgroundColor: 'transparent',
    borderColor: '#373A40',
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  rowDangerText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fa5252',
  },
});
