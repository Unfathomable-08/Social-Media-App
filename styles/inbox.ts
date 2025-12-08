import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/constants/theme";
import { wp, hp } from "@/utils/common";

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(6),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: theme.fonts.bold,
    letterSpacing: 0.5,
  } as TextStyle,
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  messageItem: {
    flexDirection: "row",
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.8),
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: wp(16),
    height: wp(16),
    borderRadius: wp(8),
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4ade80",
    borderWidth: 3,
    borderColor: "#fff",
  },

  messageContent: {
    flex: 1,
    marginLeft: wp(4),
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    fontSize: 17,
    fontWeight: "600",
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 13,
    color: "#999",
  },
  lastMessage: {
    fontSize: 15,
    color: "#666",
    marginTop: 4,
  },

  unreadBadge: {
    backgroundColor: theme.colors.primary,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(20),
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#bbb",
    marginTop: 8,
  },

  fab: {
    position: "absolute",
    right: wp(6),
    bottom: hp(4),
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});