import { StyleSheet } from "react-native";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/utils/common";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  backButton: {
    marginRight: wp(4),
  },
  avatarContainer: {
    position: "relative",
    marginRight: wp(3),
  },
  avatarPlaceholder: {
    width: hp(5.5),
    height: hp(5.5),
    borderRadius: hp(2.75),
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "white",
    fontSize: hp(2.8),
    fontWeight: "bold",
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: hp(1.8),
    height: hp(1.8),
    borderRadius: hp(0.9),
    backgroundColor: "#4ade80",
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: {
    fontSize: hp(2.4),
    fontWeight: "600",
    color: theme.colors.text,
  },
  messageContainer: {
    maxWidth: "80%",
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  theirMessage: {
    alignSelf: "flex-start",
  },
  bubble: {
    paddingHorizontal: wp(4.5),
    paddingVertical: hp(1.4),
    borderRadius: 20,
    borderBottomRightRadius: 0, // tail effect for my messages
  },
  myBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 0,
},
theirBubble: {
    backgroundColor: "#f1f1f1",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 0, // tail on left for others
  },
  messageText: {
    fontSize: hp(2.1),
    lineHeight: hp(2.6),
  },
  myText: {
    color: "white",
  },
  theirText: {
    color: "#333",
  },
  timestamp: {
    fontSize: hp(1.8),
    opacity: 0.7,
    marginTop: hp(0.5),
    alignSelf: "flex-end",
    color: "rgba(0, 0, 0, 0.8)",
  },
  
  deliveredIcon: {
    alignSelf: "flex-end",
    marginTop: hp(0.3),
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.8),
    marginRight: wp(3),
    fontSize: hp(2.1),
    maxHeight: hp(16),
    minHeight: hp(6),
  },
  sendBtn: {
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnDisabled: {
    backgroundColor: "#ccc",
  },
});