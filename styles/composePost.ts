import { StyleSheet } from "react-native";
import { wp, hp } from "@/utils/common";
import { theme } from "@/constants/theme";

export const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: wp(5),
        paddingTop: hp(2),
        paddingBottom: hp(2),
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    cancelText: {
        fontSize: hp(2.2),
        color: theme.colors.primary,
        fontWeight: "600",
    },
    postButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: wp(5),
        paddingVertical: hp(1),
        borderRadius: 30,
        minWidth: wp(22),
        alignItems: "center",
    },
    postButtonDisabled: {
        backgroundColor: "#ccc",
    },
    postButtonText: {
        color: "#fff",
        fontSize: hp(2.1),
        fontWeight: "700",
        paddingBottom: 3
    },
    postButtonTextDisabled: {
        color: "#888",
    },

    container: {
        flex: 1,
        paddingHorizontal: wp(5),
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp(2.5),
        gap: wp(3),
    },
    avatar: {
        width: hp(5.5),
        height: hp(5.5),
        borderRadius: hp(4),
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#eee",
    },
    username: {
        fontSize: hp(2.4),
        fontWeight: "bold",
        color: theme.colors.text,
    },

    textInput: {
        fontSize: hp(2.4),
        color: theme.colors.text,
        lineHeight: hp(3.8),
        paddingHorizontal: wp(1),
        minHeight: hp(20),
        paddingTop: hp(1),
    },
    textInputError: {
        backgroundColor: "#ffebee",
        borderRadius: theme.radius.lg,
        paddingHorizontal: wp(3),
    },

    imageContainer: {
        marginTop: hp(3),
        borderRadius: theme.radius.xl,
        overflow: "hidden",
        position: "relative",
        alignSelf: "flex-start",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
        elevation: 8,
    },
    previewImage: {
        width: wp(90),
        aspectRatio: "4/3",
    },
    removeBtn: {
        position: "absolute",
        top: 12,
        left: 12,
        backgroundColor: "rgba(0,0,0,0.7)",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
    },

    toolbar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: hp(3),
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        marginTop: "auto",
        marginBottom: hp(10),
        paddingHorizontal: wp(5)
    },
    iconBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: wp(2),
    },
    charCounter: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        paddingHorizontal: wp(4),
        paddingVertical: hp(1),
        borderRadius: 20,
    },
    count: {
        fontSize: hp(2.2),
        fontWeight: "bold",
    },
    slash: {
        fontSize: hp(2),
        color: "#aaa",
        marginHorizontal: wp(1),
    },
    max: {
        fontSize: hp(2),
        color: "#aaa",
    },
});