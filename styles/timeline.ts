import { StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { wp, hp } from '@/utils/common';

export const styles = StyleSheet.create({
  postBody: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.text,
  },
  postImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 12,
    marginTop: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionCount: {
    fontSize: 13,
    color: theme.colors.textSecondary || "#888",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingBottom: hp(1),
  },
  logo: {
    fontSize: hp(4),
    fontWeight: theme.fonts.extraBold,
    color: theme.colors.primary,
  },
  storiesContainer: {
    paddingVertical: hp(2),
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  storyItem: {
    alignItems: "center",
    marginRight: wp(4),
  },
  storyRing: {
    width: hp(8.5),
    height: hp(8.5),
    borderRadius: hp(4.25),
    padding: 3,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  yourStoryRing: {
    borderColor: "#ccc",
  },
  storyImage: {
    width: "100%",
    height: "100%",
    borderRadius: hp(4),
    borderWidth: 2,
    borderColor: "#fff",
  },
  plusIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  storyName: {
    marginTop: 6,
    fontSize: hp(1.5),
    color: theme.colors.text,
    fontFamily: theme.fonts.medium,
  },
  postContainer: {
    backgroundColor: "#fff",
    marginBottom: hp(3),
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(4),
  },
  postAvatar: {
    width: hp(5.5),
    height: hp(5.5),
    borderRadius: hp(2.75),
  },
  postUsername: {
    fontFamily: theme.fonts.bold,
    fontSize: hp(2),
    color: theme.colors.text,
  },
  postTime: {
    fontSize: hp(1.6),
    color: theme.colors.textLight,
  },
  postActions: {
    flexDirection: "row",
    gap: 20,
    padding: wp(4),
  },
  postFooter: {
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
  },
  likesText: {
    fontFamily: theme.fonts.bold,
    fontSize: hp(1.9),
    color: theme.colors.text,
  },
  caption: {
    marginTop: 6,
    fontSize: hp(1.9),
    color: theme.colors.text,
    lineHeight: hp(2.6),
  },
  fab: {
    position: "absolute",
    bottom: hp(6),
    right: wp(6),
    backgroundColor: theme.colors.primary,
    width: hp(7),
    height: hp(7),
    borderRadius: hp(3.5),
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    boxShadow: "0px 4px 5px rgba(0,0,0,0.3)",
  },
  avatarCircle: {
    backgroundColor: theme.colors.primary + '2F',
    width: 32,
    height: 32,
    borderRadius: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarCircleText: {
    textTransform: 'uppercase',
    fontWeight: theme.fonts.medium
  }
});