import { StyleSheet, TextStyle } from "react-native";
import { theme } from "@/constants/theme";
import { wp, hp } from "@/utils/common";

export const styles = StyleSheet.create({
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
    color: "#000",
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
    minWidth: 20,
    height: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    position: "absolute",
    right: 12,
    bottom: 12,
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
    bottom: hp(3),
    right: wp(5),
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingLeft: 12,
    marginTop: 12,
    height: 44,
    flex: 1,
    marginLeft: 16,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 5,
  },

  clearButton: {
    padding: 4,
  },

  header: {
    paddingHorizontal: wp(5),
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
  },

  searchUserItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  searchUsername: {
    fontSize: 16,
    fontWeight: "500",
  },
  searchButton2: {
    backgroundColor: theme.colors.primary,
    padding: 8,
    borderRadius: 10,
    marginVertical: 2,
  },
});
