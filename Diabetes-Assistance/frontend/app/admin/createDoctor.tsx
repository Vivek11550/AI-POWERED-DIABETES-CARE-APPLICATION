import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import API from "../../src/services/api";
import { AUTH } from "../../src/services/endpoints";
import { i18n } from "@/src/i18n/i18n";
import { router } from "expo-router";

export default function createDoctor() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const role = "doctor";

    const register = async () => {
        try {
            await API.post(AUTH.REGISTER, {
                email,
                password,
                role,
            });

            alert("Registered successfully");
            setEmail("");
            setPassword("");
        } catch (error: any) {
            const message =
                error?.response?.data?.message || "Registration failed";
            alert(message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text>{i18n.t("email")}</Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <Text>{i18n.t("password")}</Text>
            <TextInput
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />

            <Button title="Register" onPress={register} />
            <Text>Note: This registration is for doctors only</Text>



            <View style={{ marginTop: 20 }}>
                <Button
                    title="View All Doctors"
                    onPress={() => router.push("/admin/doctorList")}
                />
            </View>

            <View style={{ marginTop: 10 }}>
                <Button
                    title="View All Patients"
                    onPress={() => router.push("/admin/patientList")}
                />
            </View>

        </View>
    );
}
