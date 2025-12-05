import { theme } from "@/constants/theme";
import { hp, wp } from "@/utils/common";
import { StyleSheet, TextStyle } from "react-native";

export const styles = StyleSheet.create({
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(3),
    marginBottom: hp(2),
    paddingHorizontal: wp(4),
  },
  headerTitle: {
    fontSize: hp(2.6),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  } as TextStyle,
  backButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: "#e9e9e9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(6),
  },
  errorText: {
    fontSize: hp(2),
    color: theme.colors.textLight,
    textAlign: "center",
    marginTop: hp(2),
  },
  noComments: {
    textAlign: "center",
    padding: hp(5),
    color: theme.colors.textLight,
    fontSize: hp(2),
  },
  postAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  postName: {
    fontWeight: theme.fonts.bold,
    fontSize: hp(2.1),
    color: theme.colors.text,
  } as TextStyle,
  postUsername: {
    color: theme.colors.textLight,
    fontSize: hp(1.9),
  },
  postname: {
    color: theme.colors.dark,
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
  } as TextStyle,
  postTime: {
    color: theme.colors.textLight,
    fontSize: hp(1.8),
  },
  postText: {
    fontSize: hp(2.1),
    marginTop: hp(2),
    lineHeight: hp(3),
    color: theme.colors.text,
    paddingHorizontal: wp(4),
  },
  postImage: {
    width: "100%",
    aspectRatio: "4/3",
    borderRadius: 16,
    marginTop: hp(2),
  },
  postActions: {
    flexDirection: "row",
    gap: wp(7),
    marginTop: hp(2.5),
    alignItems: "center",
    borderColor: theme.colors.textLight + "4F",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: wp(4),
    paddingVertical: 6,
  },
  repliesTitle: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    fontSize: hp(2.2),
    fontWeight: "600",
    color: theme.colors.text,
  },
  replyFab: {
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
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionCount: {
    fontSize: hp(2),
    color: theme.colors.textLight,
  },
  commentContainer: {
    flexDirection: "row", // Avatar left, content right
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    alignItems: "flex-start",
    gap: wp(6),
  },
  commentRight: {
    flex: 1, // take remaining width
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(2),
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  commentName: {
    fontWeight: theme.fonts.semibold,
    fontSize: hp(2.1),
    color: theme.colors.text,
  } as TextStyle,
  commentUsername: {
    color: theme.colors.textLight,
    fontSize: hp(1.9),
  },
  commentTime: {
    color: theme.colors.textLight,
    fontSize: hp(1.8),
  },
  commentText: {
    fontSize: hp(2.1),
    lineHeight: hp(3),
    color: theme.colors.text,
    marginTop: hp(0.5),
  },
  commentImage: {
    width: "100%",
    aspectRatio: 4 / 3,
    borderRadius: 16,
    marginTop: hp(1.5),
  },
  commentActions: {
    flexDirection: "row",
    gap: wp(7),
    marginTop: hp(1.5),
    alignItems: "center",
  },
});
